import type { Workbook } from 'exceljs';
import type { ExcelColumn, ExcelPreviewRow, ExcelSheetAnalysis } from '../shared/excel';

const PREVIEW_ROW_LIMIT = 5;

export class ExcelInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelInputError';
  }
}

function columnLetter(position: number): string {
  let current = position;
  let letters = '';

  while (current > 0) {
    const remainder = (current - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    current = Math.floor((current - 1) / 26);
  }

  return letters;
}

export function analyzeWorkbook(
  workbook: Workbook,
  fileName: string,
  sheetName: string,
  headerRow: number,
): ExcelSheetAnalysis {
  if (!Number.isInteger(headerRow) || headerRow < 1) {
    throw new ExcelInputError('Nurodyta netinkama antraščių eilutė.');
  }

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) {
    throw new ExcelInputError('Pasirinktas Excel lapas nerastas.');
  }

  if (worksheet.rowCount === 0) {
    throw new ExcelInputError('Pasirinktas lapas yra tuščias.');
  }

  if (headerRow > worksheet.rowCount) {
    throw new ExcelInputError(`Antraščių eilutė ${headerRow} yra už lapo ribų.`);
  }

  const headerTitles = new Map<number, string>();
  const header = worksheet.getRow(headerRow);

  header.eachCell({ includeEmpty: false }, (cell, position) => {
    const text = cell.text;
    if (text.trim() !== '') {
      headerTitles.set(position, text);
    }
  });

  const dataColumns = new Set<number>();
  const previewCells: Array<Map<number, string>> = [];
  const previewRowNumbers: number[] = [];
  let anyContent = false;
  let dataRowCount = 0;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const isDataRow = rowNumber > headerRow;
    const collectPreview = isDataRow && previewCells.length < PREVIEW_ROW_LIMIT;
    const previewRow = collectPreview ? new Map<number, string>() : null;
    let hasContent = false;

    row.eachCell({ includeEmpty: false }, (cell, position) => {
      const text = cell.text;
      if (text.trim() === '') return;

      hasContent = true;
      if (!isDataRow) return;

      dataColumns.add(position);
      previewRow?.set(position, text);
    });

    if (!hasContent) return;

    anyContent = true;
    if (!isDataRow) return;

    dataRowCount += 1;
    if (previewRow !== null) {
      previewCells.push(previewRow);
      previewRowNumbers.push(rowNumber);
    }
  });

  const positions = Array.from(new Set([...headerTitles.keys(), ...dataColumns])).sort(
    (left, right) => left - right,
  );

  if (positions.length === 0) {
    throw new ExcelInputError(
      anyContent
        ? 'Nepavyko identifikuoti stulpelių. Patikrinkite antraščių eilutę.'
        : 'Pasirinktas lapas yra tuščias.',
    );
  }

  const columns: ExcelColumn[] = positions.map((position) => ({
    position,
    letter: columnLetter(position),
    title: headerTitles.get(position) ?? null,
  }));

  const previewRows: ExcelPreviewRow[] = previewCells.map((cells, index) => ({
    rowNumber: previewRowNumbers[index] ?? 0,
    cells: columns.map((column) => cells.get(column.position) ?? ''),
  }));

  return {
    fileName,
    sheetName,
    sheetNames: workbook.worksheets.map((sheet) => sheet.name),
    headerRow,
    columns,
    dataRowCount,
    previewRows,
  };
}
