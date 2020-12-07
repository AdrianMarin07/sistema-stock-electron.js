const { app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const {createDB} = require('./src/database/createDB');

createDB();
let db;
try{
  db = require('./src/database/DBAcces')();
}catch(err) {
  console.log(err);
}

ipcMain.on('db-insert', (event,args)=> {
  console.log(args);
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(path.join(__dirname + '/src/main-page.html'))
  win.webContents.openDevTools();
}

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if(db) {
    db.close(() => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });
  }else {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
