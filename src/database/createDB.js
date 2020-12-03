exports.createDB = () => {
  const fs = require("fs");
  const DBPath = "./testDB";

  if(fs.existsSync(DBPath)) {
    return
  }

  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(DBPath);
  const DBTablesCreationQuery = require("./DBTablesCreationQuery");

  db.exec(DBTablesCreationQuery, (err) => {
      if (err) console.log(err.message);
  });

  db.close();
};
