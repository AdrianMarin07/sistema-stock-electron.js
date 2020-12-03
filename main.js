const { app, BrowserWindow } = require('electron');
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

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(path.join(__dirname + '/src/main-page.html'))
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if(db) db.syncClose(db);
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
