import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { Workbook } from 'exceljs';
import { basename, join } from 'node:path';
import type { AnalyzeSheetRequest, ExcelLoadResult } from '../shared/excel';
import { analyzeWorkbook, ExcelInputError } from './excel';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3001';

const apiBaseUrl = process.env.GOODS_IMPORT_API_URL?.trim() || DEFAULT_API_BASE_URL;

let selectedWorkbook: Workbook | null = null;
let selectedFileName = '';

function toErrorMessage(error: unknown): string {
  if (error instanceof ExcelInputError) {
    return error.message;
  }

  console.error('Excel failo apdorojimo klaida:', error);
  return 'Nepavyko perskaityti Excel failo. Patikrinkite, ar failas nesugadintas ir ar tai .xlsx failas.';
}

async function selectExcelFile(): Promise<ExcelLoadResult> {
  const options: Electron.OpenDialogOptions = {
    title: 'Pasirinkite Excel failą',
    properties: ['openFile'],
    filters: [{ name: 'Excel darbaknygė', extensions: ['xlsx'] }],
  };

  const parent = BrowserWindow.getFocusedWindow();
  const result = parent
    ? await dialog.showOpenDialog(parent, options)
    : await dialog.showOpenDialog(options);

  if (result.canceled) {
    return { status: 'canceled' };
  }

  const filePath = result.filePaths[0];
  if (filePath === undefined) {
    return { status: 'canceled' };
  }

  try {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);

    const firstWorksheet = workbook.worksheets[0];
    if (!firstWorksheet) {
      throw new ExcelInputError('Pasirinktame faile nėra Excel lapų.');
    }

    const fileName = basename(filePath);
    const data = analyzeWorkbook(workbook, fileName, firstWorksheet.name, 1);

    selectedWorkbook = workbook;
    selectedFileName = fileName;

    return { status: 'ok', data };
  } catch (error) {
    return { status: 'error', message: toErrorMessage(error) };
  }
}

async function analyzeSelectedSheet(request: AnalyzeSheetRequest): Promise<ExcelLoadResult> {
  const workbook = selectedWorkbook;
  if (!workbook) {
    return { status: 'error', message: 'Pirmiausia pasirinkite Excel failą.' };
  }

  const sheetName = request?.sheetName;
  const headerRow = request?.headerRow;

  if (
    typeof sheetName !== 'string' ||
    typeof headerRow !== 'number' ||
    !Number.isInteger(headerRow) ||
    headerRow < 1
  ) {
    return { status: 'error', message: 'Nurodyta netinkama antraščių eilutė.' };
  }

  try {
    const data = analyzeWorkbook(workbook, selectedFileName, sheetName, headerRow);
    return { status: 'ok', data };
  } catch (error) {
    return { status: 'error', message: toErrorMessage(error) };
  }
}

function registerExcelHandlers(): void {
  ipcMain.handle('excel:select-file', selectExcelFile);
  ipcMain.handle('excel:analyze-sheet', (_event, request: AnalyzeSheetRequest) =>
    analyzeSelectedSheet(request),
  );
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: 'Goods Import',
    backgroundColor: '#0b1120',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void window.loadURL(rendererUrl);
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  app.setName('Goods Import');

  ipcMain.on('app:get-config', (event) => {
    event.returnValue = { apiBaseUrl };
  });

  registerExcelHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
