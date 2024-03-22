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
  }
})

contextBridge.exposeInMainWorld('node', {
  fs:{...fs},
  path:{...path},
  stat:(path)=>{
    return fs.statSync(path)
  }
})