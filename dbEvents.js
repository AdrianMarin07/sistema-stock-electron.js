const { firstToUpperCase } = require('./src/utilities/utilities');

function addEvents (ipcMain, db) {

    ipcMain.on('db-insert', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data)
        require('./src/controllers/'+ args.table).insert(db, obj)
        .then((data) => {
          event.reply('db-insert', {success: true, data});
        }).catch((err) => {
          event.reply('db-insert', {success: false, err});
        });
      })
      
      ipcMain.on('db-select', (event,args)=> {
        require('./src/controllers/'+ args.table).select(db)
        .then((data) => {
          event.reply('db-select', {success: true, data});
        }).catch((err) => {
          event.reply('db-select', {success: false, err});
        });
      })
      
      ipcMain.on('db-select-one', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data)
        require('./src/controllers/'+ args.table).selectOne(db,obj)
        .then((data) => {
          event.reply('db-select-one', {success: true, data});
        }).catch((err) => {
          event.reply('db-select-one', {success: false, err});
        });
      })
      
      ipcMain.on('db-update', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data);
        require('./src/controllers/'+ args.table).update(db, obj)
        .then((data) => {
          event.reply('db-update', {success: true, data});
        }).catch((err) => {
          event.reply('db-update', {success: false, err});
        });
      })
      
      ipcMain.on('db-delete', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table));
        const obj = new classObj(args.data);
        require('./src/controllers/'+ args.table).delete(db, obj)
        .then((data) => {
          event.reply('db-delete', {success: true, data});
        }).catch((err) => {
          event.reply('db-delete', {success: false, err});
        });
      })
}

module.exports = addEvents;
