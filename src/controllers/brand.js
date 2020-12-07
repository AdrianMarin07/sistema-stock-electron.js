const querys = require("./querys");
exports.insert = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.get(querys.insert("brand", ["name"]), [brand._name], (err, row) => {
      if (err) reject("Error in Database: " + err.message);
      resolve(row);
    });
  });
};

exports.select = (db) => {
    return new Promise((resolve, reject) => {
        db.all(querys.select('brand', ['name']), [], (err, rows) => {
            if(err) reject(err.message)

            resolve(rows)
        })
    })
};
