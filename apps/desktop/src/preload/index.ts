import { contextBridge, ipcRenderer } from 'electron';

interface AppConfig {
  apiBaseUrl: string;
}

const config = ipcRenderer.sendSync('app:get-config') as AppConfig;

contextBridge.exposeInMainWorld('goodsImport', Object.freeze(config));
