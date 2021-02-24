const { firstToUpperCase } = require('./src/utilities/utilities');
const bcrypt = require("bcrypt");
const privateKey = bcrypt.genSaltSync();

function addEvents (ipcMain, db) {

    ipcMain.on('db-insert', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data)
        require('./src/controllers/'+ args.table).insert(db, obj)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })
      
      ipcMain.on('db-select', (event,args)=> {
        require('./src/controllers/'+ args.table).select(db)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })

      ipcMain.on('db-select-record-by-product', (event,args)=> {
        require('./src/controllers/record').select(db, args.product_id)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })
      
      ipcMain.on('db-select-one', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data)
        require('./src/controllers/'+ args.table).selectOne(db,obj)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })
      
      ipcMain.on('db-update', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table))
        const obj = new classObj(args.data);
        require('./src/controllers/'+ args.table).update(db, obj)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })
      
      ipcMain.on('db-delete', (event,args)=> {
        const classObj = require('./src/models/'+ firstToUpperCase(args.table));
        const obj = new classObj(args.data);
        require('./src/controllers/'+ args.table).delete(db, obj)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })

      ipcMain.on('db-product-increase', (event,args)=> {
        const Product = require('./src/models/Product');
        const product = new Product(args.data);
        require('./src/controllers/product').addToQuantity(db, product, args.amount)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })

      ipcMain.on('db-product-decrease', (event,args)=> {
        const Product = require('./src/models/Product');
        const product = new Product(args.data);
        require('./src/controllers/product').substractFromQuantity(db, product, args.amount)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })

      ipcMain.on('login', (event,args)=> {
        const User = require('./src/models/User');
        const user = new User(args.data);
        require('./src/controllers/users').login(db, user, privateKey)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })

      ipcMain.on('verify-user', (event,args)=> {

        require('./src/controllers/users').validateJWT(args.jwt, privateKey)
        .then((data) => {
          event.reply(args.purpose, {success: true, data});
        }).catch((err) => {
          event.reply(args.purpose, {success: false, err});
        });
      })
}

module.exports = addEvents;
