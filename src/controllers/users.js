const querys = require("./querys");

const TABLE = "user";

const KEYS = [
  { table: "user", key: "id", alias: "user_id" },
  { table: "user", key: "name" },
  { table: "user", key: "last_name" },
  { table: "user", key: "email" },
  { table: "user", key: "user" },
  { table: "user", key: "password" },
  { table: "user", key: "type" },
];

exports.insert = (db, user) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        querys.insert(TABLE, KEYS),
        [
          user._name,
          user._lastName,
          user._eMail,
          user._user,
          user._password,
          user._type,
        ],
        (err) => {
          if (err) return reject("Error in Database: " + err.message);
        }
      );

      db.get(querys.selectLastAdded(TABLE, KEYS), [], (err, row) => {
        if (err) return reject("Error in Database: " + err.message);
        resolve(row);
      });
    });
  });
};

exports.select = (db) => {
  return new Promise((resolve, reject) => {
    db.all(querys.select(TABLE, KEYS), [], (err, rows) => {
      if (err) return reject(err.message);

      resolve(rows);
    });
  });
};

exports.selectOne = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(querys.selectOne(TABLE, KEYS), [user._id], (err, row) => {
      if (err) return reject(err.message);
      resolve(row);
    });
  });
};

exports.update = (db, user) => {
  return new Promise((resolve, reject) => {
    db.get(
      querys.update(TABLE, KEYS),
      [
        user._name,
        user._lastName,
        user._eMail,
        user._user,
        user._password,
        user._type,
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
