const { firstToUpperCase } = require('./src/utilities/utilities');

function addEvents (ipcMain, db) {

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
      
      ipcMain.on('db-select-one', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data)
        require('./src/controllers/'+ args.table).selectOne(db,obj)
        .then((data) => {
          console.log(data);
        }).catch((err) => {
          console.log(err);
        });
      })
      
      ipcMain.on('db-update', (event,args)=> {
        require('./src/controllers/'+ args.table).update(db, obj)
        .then((data) => {
          console.log(data);
        }).catch((err) => {
          console.log(err);
        });
      })
      
      ipcMain.on('db-delete', (event,args)=> {
        require('./src/controllers/'+ args.table).delete(db, obj)
        .then((data) => {
          console.log(data);
        }).catch((err) => {
          console.log(err);
        });
      })
}

module.exports = addEvents;
