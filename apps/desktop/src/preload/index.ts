import { contextBridge, ipcRenderer } from 'electron';
import type { AnalyzeSheetRequest, ExcelLoadResult } from '../shared/excel';

interface AppConfig {
  apiBaseUrl: string;
}

interface GoodsImportApi extends AppConfig {
  selectExcelFile(): Promise<ExcelLoadResult>;
  analyzeExcelSheet(request: AnalyzeSheetRequest): Promise<ExcelLoadResult>;
}

const config = ipcRenderer.sendSync('app:get-config') as AppConfig;

const api: GoodsImportApi = {
  ...config,
  selectExcelFile: () => ipcRenderer.invoke('excel:select-file') as Promise<ExcelLoadResult>,
  analyzeExcelSheet: (request) =>
    ipcRenderer.invoke('excel:analyze-sheet', request) as Promise<ExcelLoadResult>,
};

contextBridge.exposeInMainWorld('goodsImport', Object.freeze(api));
