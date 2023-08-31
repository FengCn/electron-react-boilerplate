// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'robotjs';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    openWindow(id: number | undefined) {
      ipcRenderer.send('webview-dom-ready', id);
    },
    handleUrl: (
      callback: (
        event: Electron.IpcRendererEvent,
        ...args: any[]
      ) => /* eslint no-unused-vars: off */
      void
    ) => ipcRenderer.on('update-url', callback),
    handleMousePos: (
      callback: (
        event: Electron.IpcRendererEvent,
        ...args: any[]
      ) => /* eslint no-unused-vars: off */
      void
    ) => ipcRenderer.on('mouse-pos', callback),
    handlePushFeoUsers: (
      callback: (
        event: Electron.IpcRendererEvent,
        ...args: any[]
      ) => /* eslint no-unused-vars: off */
      void
    ) => ipcRenderer.on('push-feo-users', callback),
  },

};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
