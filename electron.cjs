const path = require('path');
const {app, BrowserWindow} = require('electron')
const remote = require('@electron/remote/main')

remote.initialize();

const proc = process;
const dir = __dirname

const window = {frame:null};
const config = {
  dev:{
    url:'http://localhost:5173',
  },
  prod:{
    url:`dist/index.html`,
  }
}

function createWindow() {

    window.frame = new BrowserWindow({
      width: 800,
      icon: './src/public/assets/icons/game-vault.png',
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(dir, 'preload.cjs'),
      },
      titleBarStyle:"hidden",
      autoHideMenuBar: true,
    });

    remote.enable(window.frame.webContents);

    window.frame.loadURL(config.dev.url)
    .then(()=>{
      console.log("working")
      window.frame.webContents.openDevTools()
    })
    .catch(()=>{
      console.log("error")  
      window.frame.loadFile(config.prod.url)
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
  if (proc.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window.frame === null) {
    createWindow();
  }
});

