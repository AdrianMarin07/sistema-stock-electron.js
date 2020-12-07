exports.insert = (tableName, keys) => {
    return `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${'?, '.repeat(keys.length).slice(0,-2)})`;
};

exports.select = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT (${keys.join(", ")}) FROM ${tableName}`;
    }
    
    return `SELECT (${keys.join(", ")}) FROM ${tableName} ${innerJoinns.map((item) => {`INNER JOIN on ${item.t1}.${item.key1} = ${item.t2}.${item.key2}`}).join(" ")}`;
};

exports.delete = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id=?`;
};

exports.update = (tableName, keys) => {
    return `UPDATE ${tableName} SET ${keys.map((key) => {`${key} = ?`}).join(" ")} WHERE id = ?`;
};