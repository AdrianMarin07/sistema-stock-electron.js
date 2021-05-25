const querys = require("./querys");
const recordControler = require("./record");

const TABLE = "product";

const KEYS = [
  { table: "product", key: "id", alias: "product_id" },
  { table: "product", key: "details" },
  { table: "product", key: "quantity", alias: "total"},
  { table: "product", key: "price"},
  { table: "product", key: "barcode"},
  { table: "product", key: "min_quantity"},
  { table: "product", key: "fk_type" },
  { table: "product", key: "fk_brand" },
  { table: "type", key: "name", alias: "type_name" },
  { table: "brand", key: "name", alias: "brand_name" }
];

const INNER_JOINS = [
  { t1: "product", k1: "fk_type", t2: "type", k2: "id" },
  { t1: "product", k1: "fk_brand", t2: "brand", k2: "id" }
];

exports.insert = (db, product) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        querys.insert(TABLE, KEYS),
        [product._detail, product._quantity, product._price, product._barcode, product._minQuantity, product._type._id, product._brand._id],
        (err) => {
          if (err) return reject("Error in Database: " + err.message);
        }
      );

      db.get(querys.selectLastAdded(TABLE, KEYS, INNER_JOINS), [], (err, row) => {
        if (err) return reject("Error in Database: " + err.message);
        resolve(row);
      });
    });
  });
};

exports.select = (db) => {
  return new Promise((resolve, reject) => {
    db.all(querys.select(TABLE, KEYS, INNER_JOINS), [], (err, rows) => {
      if (err) return reject(err.message);

      resolve(rows);
    });
  });
};

exports.selectOne = (db, product) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS, INNER_JOINS), [product._id], (err, row) => {
      if (err) return reject(err.message);
      resolve(row);
    });
  });
};

exports.update = (db, product) => {
  return new Promise((resolve, reject) => {
    db.get(
      querys.update(TABLE, KEYS.filter(item => item.key != "quantity")),
      [product._detail, product._price, product._barcode, product._minQuantity, product._type._id, product._brand._id,product._id],
      (err, row) => {
        console.log(KEYS.filter(item => item.key != "quantity"));
        if (err) return reject(err.message);
        resolve(row);
      }
    );
  });
};

exports.delete = (db, product) => {
  return new Promise((resolve, reject) => {
    db.get(querys.verifyExistence('record', 'fk_product'), [product._id], (err, row) => {
      if (err) return reject(err.message);
      if(row)  return reject('There are records with this product as a foreign key');
      db.get(querys.delete(TABLE), [product._id], (err, row) => {
        if (err) return reject(err.message);
        resolve(row);
      });
    }); 
  });
};

exports.addToQuantity = (db, product, amount) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS, INNER_JOINS), [product._id], (err, product) => {
      if (err) return reject(err.message);
      db.get(
        querys.update(TABLE, [{table: "product", key: "quantity"}]),
        [product.total + amount, product.product_id],
        (err) => {
          if (err) return reject(err.message);
          recordChangeOfQuantity(db, 0, resolve, reject, amount, product);
        }
      );
    });
  });
}

exports.substractFromQuantity = (db, product, amount) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS, INNER_JOINS), [product._id], (err, product) => {
      if (err) return reject(err.message);
      if (product.total - amount < 0) return reject("Error product quantity cannot be under zero");
      db.get(
        querys.update(TABLE, [{table: "product", key: "quantity"}]),
        [product.total - amount, product.product_id],
        (err, row) => {
          if (err) return reject(err.message);
          recordChangeOfQuantity(db, 1, resolve, reject, amount, product);
        }
      );
    });
  });
}


function recordChangeOfQuantity(db,transaction, resolve, reject, amount, product) {
  const now = new Date(Date.now());
  const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const record = {_transaction: transaction, _date: date, _quantity: amount, _product: {_id: product.product_id}};
  recordControler.insert(db, record)
  .then((data)=> {
    resolve({newAmount: product.total + amount});
  })
  .catch((err)=> {
    return reject(err);
  })
}