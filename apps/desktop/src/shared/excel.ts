export interface ExcelColumn {
  position: number;
  letter: string;
  title: string | null;
}

export interface ExcelPreviewRow {
  rowNumber: number;
  cells: string[];
}

export interface ExcelSheetAnalysis {
  fileName: string;
  sheetName: string;
  sheetNames: string[];
  headerRow: number;
  columns: ExcelColumn[];
  dataRowCount: number;
  previewRows: ExcelPreviewRow[];
}

export interface AnalyzeSheetRequest {
  sheetName: string;
  headerRow: number;
}

export type ExcelLoadResult =
  | { status: 'ok'; data: ExcelSheetAnalysis }
  | { status: 'canceled' }
  | { status: 'error'; message: string };
