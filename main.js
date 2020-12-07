const { app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const { firstToUpperCase } = require('./src/utilities/utilities');
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
  const classObj = require('./src/models/'+ firstToUpperCase(args.table))
  const obj = new classObj(args.data)
  require('./src/controllers/'+ args.table).insert(db, obj)
  .then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  });
})

ipcMain.on('db-select', (event,args)=> {
  require('./src/controllers/'+ args.table).select(db)
  .then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  });
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
