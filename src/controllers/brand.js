const querys = require("./querys");

const TABLE = "brand";
const KEYS = [
  { key: "id", table: "brand", alias: "brand_id" },
  { key: "name", table: "brand", alias: "brand_name" },
];

exports.insert = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(querys.insert(TABLE, KEYS), [brand._name], (err) => {
        if (err) reject("Error in Database: " + err.message);
      });

      db.get(querys.selectLastAdded(TABLE, KEYS), [], (err, row) => {
        if (err) reject("Error in Database: " + err.message);
        resolve(row);
      });
    });
  });
};

exports.select = (db) => {
  return new Promise((resolve, reject) => {
    db.all(querys.select(TABLE, KEYS), [], (err, rows) => {
      if (err) reject(err.message);

      resolve(rows);
    });
  });
};

exports.selectOne = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS), [brand._id], (err, row) => {
      if (err) reject(err.message);
      resolve(row);
    });
  });
};

exports.update = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.get(querys.update(TABLE, KEYS), [brand._name, brand._id], (err, row) => {
      if (err) reject(err.message);
      resolve(row);
    });
  });
};

exports.delete = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.get(querys.delete(TABLE), [brand._id], (err, row) => {
      if (err) reject(err.message);
      resolve(row);
    });
  });
};
