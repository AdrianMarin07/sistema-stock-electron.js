exports.createDB = () => {
  const fs = require("fs");
  const DBPath = "./testDB";
  const bcrypt = require("bcrypt");

  if(fs.existsSync(DBPath)) {
    return
  }

  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(DBPath);
  const DBTablesCreationQuery = require("./DBTablesCreationQuery");

  db.exec(DBTablesCreationQuery, (err) => {
      if (err) console.log(err.message);
  });

  bcrypt.hash("1234", 10, function(err, hash) {
    db.run("INSERT INTO users (name, last_name, user, password, type) VALUES (?,?,?,?,?)",["nombre", "apellido", "admin", hash, "admin"], (err) => {
      if (err) console.log(err.message);
    });
  });

  db.close();
};
