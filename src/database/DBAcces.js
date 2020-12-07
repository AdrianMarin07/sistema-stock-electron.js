const fs = require("fs");
const { debuglog } = require("util");
const DBPath = "./testDB";
const sqlite3 = require("sqlite3").verbose();

module.exports = () => {
  if (!fs.existsSync(DBPath)) {
    throw new Error("Data base not found");
  }
  const db = new sqlite3.Database(DBPath);
  return db;
};
