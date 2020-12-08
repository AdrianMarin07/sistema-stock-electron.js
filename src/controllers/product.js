
const TABLE = 'product';

const KEYS = 
[
    {table: 'product', key: 'details'},
    {table: 'product', key: 'fk_type'},
    {table: 'type', key: 'name', alias: 'type_name'},
    {table: 'type', key: 'fk_brand'},
    {table: 'brand', key: 'name', alias: 'brand_name'},
];

const INNER_JOINS = 
[
    {t1: "product", k1: "fk_type", t2: "type", k2: "id"},
    {t1: "type", k1: "fk_brand", t2: "brand", k2: "id"}
];

exports.insert = (db, product) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
          db.run(querys.insert(TABLE, KEYS), [product._detail, product._type._id], (err) => {
              if (err) reject("Error in Database: " + err.message);
          });
  
          db.get(querys.selectLastAdded(TABLE,KEYS), [], (err, row) => {
              if ( err ) reject("Error in Database: " + err.message);
              resolve(row)
          })
      });
    });
  };
  
exports.select = (db) => {
    return new Promise((resolve, reject) => {
        db.all(querys.select(TABLE, KEYS), [], (err, rows) => {
            if(err) reject(err.message)

            resolve(rows)
        })
    })
};


exports.selectOne = (db, product) => {
    return new Promise((resolve, reject) => {
        db.get(querys.selectOne(TABLE, KEYS), [product._id], (err, rows) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.update = (db, product) => {
    return new Promise((resolve, reject) => {
        db.get(querys.update(TABLE, KEYS), [product._detail, product._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.delete = (db, product) => {
    return new Promise((resolve, reject) => {
        db.get(querys.delete(TABLE), [product._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

