const fs = require("fs");
const { debuglog } = require("util");
const DBPath = "./testDB";
const sqlite3 = require("sqlite3").verbose();

const syncClose = async (db) => {
  await db.close()
}

module.exports = () => {
  if (!fs.existsSync(DBPath)) {
    throw new Error("Data base not found");
  }
  const db = new sqlite3.Database(DBPath);
  db.syncClose = syncClose;
  return db;
};
