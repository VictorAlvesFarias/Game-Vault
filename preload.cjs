const remote = require('@electron/remote')
const { contextBridge } = require('electron')
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('application', {
  status: () => {
    return "online"
  },
  close: () => {
    remote.getCurrentWindow().close()
  },
  minimized: () => {
    remote.getCurrentWindow().minimize()
  },
  maximize: () => {
    remote.getCurrentWindow().maximize()
  },
  minimizable: () => {
    remote.getCurrentWindow().minimize()
  },
  maximizable: () => {
    remote.getCurrentWindow().maximizable()
  },
  isMaximizable: () => {
    return remote.getCurrentWindow().isMaximizable()
  }
})

contextBridge.exposeInMainWorld('node', {
  fs:{...fs},
  path:{...path},
  dialog:{...remote.dialog},
  isDirectory:async (param)=> (await fs.promises.stat(param)).isDirectory()
})