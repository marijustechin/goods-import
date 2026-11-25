import type { AnalyzeSheetRequest, ExcelLoadResult } from '../shared/excel';

export interface GoodsImportApi {
  apiBaseUrl: string;
  selectExcelFile(): Promise<ExcelLoadResult>;
  analyzeExcelSheet(request: AnalyzeSheetRequest): Promise<ExcelLoadResult>;
}

declare global {
  interface Window {
    goodsImport?: GoodsImportApi;
  }
}

export {};
