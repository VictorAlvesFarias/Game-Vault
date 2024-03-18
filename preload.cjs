const { contextBridge } = require('electron')
const remote = require('@electron/remote');

contextBridge.exposeInMainWorld('application', {
  isWorking: () => {
    true
  },
  close: () =>{
    remote.getCurrentWindow().close()
  },
  minimized: () =>{
    remote.getCurrentWindow().minimize()
  },
})