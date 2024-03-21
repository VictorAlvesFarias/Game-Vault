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
  writeFile: async (filePath, body) => {
    const result = fs.writeFileSync(filePath, body, (err) => { console.log(err) })

    return result
  },
  getFile: fs.readFileSync,
  replaceFolder: async (originPath, finalPath) => {
    const result = fs.cpSync(originPath, finalPath, { recursive: true });

    return result
  },
  getStats:async (path) => {
    const result = fs.statSync(path)
    console.log(result)

    return result
  },
})
