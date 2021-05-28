const { firstToUpperCase } = require('./src/utilities/utilities');
const bcrypt = require("bcrypt");
const privateKey = bcrypt.genSaltSync();
const { dialog, app } = require('electron');
const jsPDF = require('jspdf');
require("./src/styles/fonts/openSansUTF8")(jsPDF);
require("jspdf-autotable");

function addEvents(ipcMain, db, win) {

  ipcMain.on('db-insert', (event, args) => {
    const classObj = require('./src/models/' + firstToUpperCase(args.table))
    const obj = new classObj(args.data)
    require('./src/controllers/' + args.table).insert(db, obj)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-select', (event, args) => {
    require('./src/controllers/' + args.table).select(db)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-select-record-by-product', (event, args) => {
    require('./src/controllers/record').select(db, args.product_id)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-select-one', (event, args) => {
    const classObj = require('./src/models/' + firstToUpperCase(args.table))
    const obj = new classObj(args.data)
    require('./src/controllers/' + args.table).selectOne(db, obj)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-update', (event, args) => {
    const classObj = require('./src/models/' + firstToUpperCase(args.table))
    const obj = new classObj(args.data);
    require('./src/controllers/' + args.table).update(db, obj)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-delete', (event, args) => {
    const classObj = require('./src/models/' + firstToUpperCase(args.table));
    const obj = new classObj(args.data);
    require('./src/controllers/' + args.table).delete(db, obj)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-product-increase', (event, args) => {
    const Product = require('./src/models/Product');
    const product = new Product(args.data);
    require('./src/controllers/product').addToQuantity(db, product, args.amount)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-product-decrease', (event, args) => {
    const Product = require('./src/models/Product');
    const product = new Product(args.data);
    require('./src/controllers/product').substractFromQuantity(db, product, args.amount)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('login', (event, args) => {
    const User = require('./src/models/Users');
    const user = new User(args.data);
    require('./src/controllers/users').login(db, user, privateKey)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('verify-user', (event, args) => {
    require('./src/controllers/users').validateJWT(args.jwt, privateKey)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('db-select-purchase-list', (event, args) => {
    require('./src/controllers/stock').selectPurchaseList(db)
      .then((data) => {
        event.reply(args.purpose, { success: true, data });
      }).catch((err) => {
        event.reply(args.purpose, { success: false, err });
      });
  })

  ipcMain.on('save-table-asPDF', (event, args) => {
    const options = {
      defaultPath: app.getPath('documents'),
    }
    dialog.showSaveDialog(win, options)
      .then((path) => {
        if(!path.canceled) {
          const doc = new jsPDF.default;
        doc.setFont("open-sans-v18-latin-regular", "normal");
        doc.setFontSize(12);
        doc.autoTable({
          theme: "grid",
          head: [args.tableRows[0]],
          body: [...args.tableRows.slice(1)],
        })
        const pathToFile = /\w*(\.pdf)$/.test(path.filePath) ? path.filePath : path.filePath +  ".pdf";
        doc.save(pathToFile);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
}

module.exports = addEvents;
