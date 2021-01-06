const querys = require("./querys");

const TABLE = "record";

const KEYS = [
  { table: "record", key: "id", alias: "record_id" },
  { table: "record", key: "transaction_type" },
  { table: "record", key: "date" },
  { table: "record", key: "quantity" },
  { table: "record", key: "fk_product" },
  { table: "product", key: "details" },
  { table: "product", key: "quantity", alias: "total"},
  { table: "product", key: "fk_type" },
  { table: "type", key: "name", alias: "type_name" },
  { table: "type", key: "fk_brand" },
  { table: "brand", key: "name", alias: "brand_name" },
];

const INNER_JOINS = [
  { t1: "record", k1: "fk_product", t2: "product", k2: "id" },
  { t1: "product", k1: "fk_type", t2: "type", k2: "id" },
  { t1: "type", k1: "fk_brand", t2: "brand", k2: "id" },
];

exports.insert = (db, record) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        querys.insert(TABLE, KEYS),
        [
          record._transaction,
          record._date,
          record._quantity,
          record._product._id,
        ],
        (err) => {
          if (err) reject("Error in Database: " + err.message);
        }
      );

      db.get(
        querys.selectLastAdded(TABLE, KEYS, INNER_JOINS),
        [],
        (err, row) => {
          if (err) reject("Error in Database: " + err.message);
          resolve(row);
        }
      );
    });
  });
};

exports.select = (db, id_product) => {
  return new Promise((resolve, reject) => {
    db.all(querys.select(TABLE, KEYS, INNER_JOINS) + "WHERE fk_product=?", [id_product], (err, rows) => {
      if (err) reject(err.message);

      resolve(rows);
    });
  });
};

exports.selectOne = (db, record) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS, INNER_JOINS), [record._id], (err, row) => {
      if (err) reject(err.message);
      resolve(row);
    });
  });
};

exports.update = (db, record) => {
  return new Promise((resolve, reject) => {
    db.get(
      querys.update(TABLE, KEYS),
      [
        record._transaction,
        record._date,
        record._quantity,
        record._product._id,
        record._id,
      ],
      (err, row) => {
        if (err) reject(err.message);
        resolve(row);
      }
    );
  });
};

exports.delete = (db, record) => {
  return new Promise((resolve, reject) => {
    db.get(querys.delete(TABLE), [record._id], (err, row) => {
      if (err) reject(err.message);
      resolve(row);
    });
  });
};
