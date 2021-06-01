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

  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.exec(DBTablesCreationQuery, (err) => {
        if (err) console.log(err.message);
      });

      db.run("INSERT INTO users (name, last_name, user, password, type) VALUES (?,?,?,?,?)", ["nombre", "apellido", "admin", "1234", "admin"], (err) => {
        if (err) console.log(err.message);
        resolve("");
      });
    })
  }).then(()=>{
    db.close();
  }).catch((err)=>{
    db.close();
  })


};
