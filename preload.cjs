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
  },
  writeFileAsync: async (filePath, body) => {
    const result = fs.writeFile(filePath, body,(err) => {console.log(err)})

    return result
  },
  getFileAsync: async (filePath) => {
    const result = await fs.readFile(filePath, 'utf-8',(err) => {console.log(err)})

    return result
  },
  replaceFolder: async (originPath, finalPath) => {
    const result = fs.cp(originPath, finalPath, {recursive: true}, (err) => {console.log(err)});
    
    return result
  }
})
