const remote = require('@electron/remote')
const { contextBridge } = require('electron')
const fs = require('fs');

contextBridge.exposeInMainWorld('application', {
  status: () => {
    return "online"
  },
  close: () => {
    remote.getCurrentWindow().close()
  },
  minimized: () => {
    remote.getCurrentWindow().minimize()
  }
})

contextBridge.exposeInMainWorld('fs', {
  ...fs
})
