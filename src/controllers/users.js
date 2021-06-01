const querys = require("./querys");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TABLE = "users";

const KEYS = [
  { table: "users", key: "id", alias: "user_id" },
  { table: "users", key: "name" },
  { table: "users", key: "last_name" },
  { table: "users", key: "email" },
  { table: "users", key: "user" },
  { table: "users", key: "password" },
  { table: "users", key: "type" },
];

exports.insert = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT EXISTS(SELECT user FROM users WHERE user=?) AS alreadyUsed",
      [user._user],
      (err, row) => {
        if (err) return reject(err.message);
        if (row.alreadyUsed == 1) return reject("User already exists");
        bcrypt.hash(user._password, 10, function(err, hash) {
          if(err) return reject(err);
          db.serialize(() => {
            db.run(
              querys.insert(TABLE, KEYS),
              [
                user._name,
                user._lastName,
                user._eMail,
                user._user,
                hash,
                user._type,
              ],
              (err) => {
                if (err) return reject("Error in Database: " + err.message);
              }
            );
  
            db.get(querys.selectLastAdded(TABLE, [
              KEYS[0],
              KEYS[1],
              KEYS[2],
              KEYS[3],
              KEYS[4],
              KEYS[6],
            ]), [], (err, row) => {
              if (err) return reject("Error in Database: " + err.message);
              resolve(row);
            });
          });
        })
      }
    );
  });
};

exports.select = (db) => {
  return new Promise((resolve, reject) => {
    db.all(
      querys.select(TABLE, [
        KEYS[0],
        KEYS[1],
        KEYS[2],
        KEYS[3],
        KEYS[4],
        KEYS[6],
      ]),
      [],
      (err, rows) => {
        if (err) return reject(err.message);
        resolve(rows);
      }
    );
  });
};

exports.selectOne = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, [
      KEYS[0],
      KEYS[1],
      KEYS[2],
      KEYS[3],
      KEYS[4],
      KEYS[6],
    ]), [user._id], (err, row) => {
      if (err) return reject(err.message);
      resolve(row);
    });
  });
};

exports.update = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(
      querys.update(TABLE, [
        KEYS[1],
        KEYS[2],
        KEYS[3],
        KEYS[4],
        KEYS[6],
      ]),
      [
        user._name,
        user._lastName,
        user._eMail,
        user._user,
        user._type,
        user._id
      ],
      (err, row) => {
        if (err) return reject(err.message);
        resolve(row);
      }
    );
  });
};

exports.delete = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(querys.delete(TABLE), [user._id], (err, row) => {
      if (err) return reject(err.message);
      resolve(row);
    });
  });
};

exports.login = (db, user, privateKey) => {
  return new Promise((resolve, reject)=>{
    db.get(querys.select(TABLE,KEYS) + " WHERE user=?",[user._user], (err, row)=> {
      if(err) return reject(err.message)
      if(!row) return reject("Invalid user or password")
      bcrypt.compare(user._password, row.password,(err,result) => {
        if(err) return reject(err.message+"apa")
        if(result) {
          row.password = "";
          jwt.sign(row, privateKey, function(err, token) {
            if(err) return reject(err.message)
            resolve(token);
          });
        } else {
          reject("Invalid user or password")
        }
    })
    })
  })
}

exports.validateJWT = (jsonwebtoken, privateKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(jsonwebtoken, privateKey, (err, decoded) => {
      if (err) return reject(err.message)
      resolve(decoded)
    })
  })
}

exports.changePassword = (db, user, newPassword) => {
  return new Promise((resolve, reject)=>{
    db.get(querys.select(TABLE,KEYS) + " WHERE id=?",[user._id], (err, row)=> {
      if(err) return reject(err.message)
        bcrypt.compare(user._password, row.password,(err,result) => {
          if(err) return reject(err.message)
          if(result) {
            db.run('UPDATE users SET=? WHERE id=?',  [newPassword, user._id],(err) => {
              if(err) return reject(err.message)
              resolve("Change succesfull")
            })
          } else {
            reject("Invalid password")
          }
      })
    })
  })
}