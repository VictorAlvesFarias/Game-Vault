const { app, BrowserWindow } = require('electron');
const { join,  } = require('path');
const server = require('./src/api/server.cjs');
const remote = require('@electron/remote/main')

const windowElectron = {
  frame: null
};

const config = {
  dev: {
    url: 'http://localhost:5173',
  },
  prod: {
    url: `dist/index.html`,
  }
};

function createWindowElectron() {
  const preloadPath = join(__dirname, 'preload.cjs');

  windowElectron.frame = new BrowserWindow({
    width: 800,
    icon: './src/public/assets/icons/game-vault.png',
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: preloadPath
    },
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
  });

  remote.enable(windowElectron.frame.webContents);
  remote.initialize()
  windowElectron.frame.loadURL(config.dev.url)
    .then(() => {
      windowElectron.frame.webContents.openDevTools();
    })
    .catch(() => {
      windowElectron.frame.loadFile(config.prod.url)
        .then(() => {
          console.log("working");
        })
        .catch(() => {
          console.log("error");
        });
    });
}

app.whenReady().then(() => {
  createWindowElectron();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindowElectron();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

server()

module.exports = { windowElectron };
