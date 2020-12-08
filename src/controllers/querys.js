
exports.insert = (tableName, keys) => {
    const insertKeys = keys.map(key => {if(key.table === tableName && key.key != 'id') return`${key.key}`});
    return `INSERT INTO ${tableName} ${insertKeys.join(", ")} VALUES (${'?, '.repeat(insertKeys.length).slice(0,-2)})`;
};

exports.select = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName}`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => {`INNER JOIN on ${item.t1}.${item.key1} = ${item.t2}.${item.key2}`}).join(" ")}`;
};

exports.selectLastAdded = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} WHERE id= (SELECT MAX(id) FROM ${tableName})`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => {`INNER JOIN on ${item.t1}.${item.key1} = ${item.t2}.${item.key2}`}).join(" ")} WHERE id= (SELECT MAX(id) FROM ${tableName})`;
};

exports.selectOne = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} WHERE id=?`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => {`INNER JOIN on ${item.t1}.${item.key1} = ${item.t2}.${item.key2}`}).join(" ")}`;
};

exports.delete = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id=?`;
};

exports.update = (tableName, keys) => {
    return `UPDATE ${tableName} SET ${keys.map((key) => {if(key.table === tableName && key.key != 'id') return`${key.key} = ?`}).join(" ")} WHERE id = ?`;
};
