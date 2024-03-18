const { app ,BrowserWindow } = require('electron')
const remote = require('@electron/remote/main');
const path = require("path")

remote.initialize();

let mainWindow;

const config = {
  url:{
    dev:'http://localhost:5173',
    prod:`dist/index.html`
  }
}

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.cjs'),
      },
    });

    remote.enable(mainWindow.webContents);

    mainWindow.loadURL(config.url.dev)
    .then(()=>{
      console.log("working")
    })
    .catch(()=>{
      console.log("error")  
      mainWindow.loadFile(config.url.prod)
      .then(()=>{
        console.log("working");
      })
      .catch(()=>{
        console.log("error")
      });
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

