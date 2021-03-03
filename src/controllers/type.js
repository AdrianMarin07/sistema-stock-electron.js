const querys = require("./querys");

const TABLE = 'type';
const KEYS = 
[
    {table: 'type', key: 'id', alias: 'type_id'},
    {table: 'type', key: 'name', alias: 'type_name'},
];


exports.insert = (db, type) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run(querys.insert(TABLE, KEYS), [type._name], (err, row) => {
            if (err) return reject("Error in Database: " + err.message);
          });

        db.get(querys.selectLastAdded(TABLE, KEYS), [], (err, row) => {
            if ( err ) return reject("Error in Database: " + err.message);
            resolve(row)
        })
    });
  });
};

exports.select = (db) => {
    return new Promise((resolve, reject) => {
        db.all(querys.select(TABLE, KEYS), [], (err, rows) => {
            if(err) return reject(err.message)

            resolve(rows)
        })
    })
};


exports.selectOne = (db, type) => {
    return new Promise((resolve, reject) => {
        db.get(querys.selectOne(TABLE, KEYS), [type._id], (err, row) => {
            if(err) return reject(err.message)
            resolve(row)
        })
    })
};

exports.update = (db, type) => {
    return new Promise((resolve, reject) => {
        db.get(querys.update(TABLE, KEYS), [type._name, type._id], (err, row) => {
            if(err) return reject(err.message)
            resolve(row)
        })
    })
};

exports.delete = (db, type) => {
    return new Promise((resolve, reject) => {    db.serialize(() => {
        db.get(querys.verifyExistence('product', 'fk_type'), [type._id], (err, row) => {
            if (err) return reject(err.message);
            if (row) return reject('There are products with this type as a foreign key');
            db.get(querys.delete(TABLE), [type._id], (err, row) => {
              if (err) return reject(err.message);
              resolve(row);
            });
          }); 
      });
    });
};
