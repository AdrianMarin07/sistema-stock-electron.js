const querys = require("./querys");
exports.insert = (db, brand) => {
  return new Promise((resolve, reject) => {
    db.run(querys.insert("brand", ["name"]), [brand._name], (err, row) => {
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


exports.selectOne = (db, brand) => {
    return new Promise((resolve, reject) => {
        db.get(querys.selectOne('brand', ['name']), [brand._id], (err, rows) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.update = (db, brand) => {
    return new Promise((resolve, reject) => {
        db.get(querys.update('brand', ['name']), [brand._name, brand._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.delete = (db, brand) => {
    return new Promise((resolve, reject) => {
        db.get(querys.delete('brand', ['name']), [brand._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};
