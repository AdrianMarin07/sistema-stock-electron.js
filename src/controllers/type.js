const TABLE = 'type';
const KEYS = 
[
    {table: 'type', key: 'id', alias: 'type_id'},
    {table: 'type', key: 'name', alias: 'type_name'},
    {table: 'type', key: 'fk_brand'},
    {table: 'brand', key: 'name', alias: 'brand_name'}
];

const INNER_JOINS = 
[
    {t1: "type", k1: "fk_brand", t2: "brand", k2: "id"}
];


exports.insert = (db, type) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run(querys.insert(TABLE, KEYS), [type._name, type._brand._id], (err, row) => {
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
        db.all(querys.select(TABLE, KEYS, INNER_JOINS), [], (err, rows) => {
            if(err) reject(err.message)

            resolve(rows)
        })
    })
};


exports.selectOne = (db, type) => {
    return new Promise((resolve, reject) => {
        db.get(querys.selectOne(TABLE, KEYS, INNER_JOINS), [type._id], (err, rows) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.update = (db, type) => {
    return new Promise((resolve, reject) => {
        db.get(querys.update(TABLE, KEYS), [type._name, type._brand._id, type._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};

exports.delete = (db, type) => {
    return new Promise((resolve, reject) => {
        db.get(querys.delete(TABLE), [type._id], (err, row) => {
            if(err) reject(err.message)
            resolve(row)
        })
    })
};
