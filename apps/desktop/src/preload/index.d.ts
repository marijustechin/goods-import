export interface GoodsImportConfig {
  apiBaseUrl: string;
}

declare global {
  interface Window {
    goodsImport?: GoodsImportConfig;
  }
}

export {};
