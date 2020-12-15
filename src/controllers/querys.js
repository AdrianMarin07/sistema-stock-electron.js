
exports.insert = (tableName, keys) => {
    const insertKeys = keys.filter((key) => key.table === tableName && key.key != 'id').map(key => {return`${key.key}`});
    return `INSERT INTO ${tableName} (${insertKeys.join(", ")}) VALUES (${'?, '.repeat(insertKeys.length).slice(0,-2)})`;
};

exports.select = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName}`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => `INNER JOIN ${item.t2} on ${item.t1}.${item.k1} = ${item.t2}.${item.k2}`).join(" ")}`;
};

exports.selectLastAdded = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} WHERE ${tableName}.id= (SELECT MAX(${tableName}.id) FROM ${tableName})`;
    }
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => `INNER JOIN ${item.t2} on ${item.t1}.${item.k1} = ${item.t2}.${item.k2}`).join(" ")} WHERE ${tableName}.id= (SELECT MAX(${tableName}.id) FROM ${tableName})`;
};

exports.selectOne = (tableName, keys, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} WHERE ${tableName}.id=?`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => `INNER JOIN ${item.t2} on ${item.t1}.${item.k1} = ${item.t2}.${item.k2}`).join(" ")} WHERE ${tableName}.id=?`;
};

exports.verifyExistence = (tableName, key) => {
    return `SELECT ${key} FROM ${tableName} WHERE ${key} = ?`;
}

exports.delete = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id = ?`;
};

exports.update = (tableName, keys) => {
    return `UPDATE ${tableName} SET ${keys.map((key) => {if(key.table === tableName && key.key != 'id') return`${key.key} = ?`}).join(" ")} WHERE id = ?`;
};

exports.selectForSearch = (tableName, keys, searchPatterns, innerJoinns) => {
    if (!innerJoinns) {
        return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} WHERE ${searchPatterns.map((obj) => `${obj.column} = %${obj.pattern}%` ).join(', ')}`;
    }
    
    return `SELECT ${keys.map((key)=> `${key.table}.${key.key} ${key.alias ? "AS " + key.alias : ""}`).join(", ")} FROM ${tableName} ${innerJoinns.map((item) => `INNER JOIN ${item.t2} on ${item.t1}.${item.k1} = ${item.t2}.${item.k2}`).join(" ")} WHERE ${searchPatterns.map((obj) => `${obj.table}.${obj.column} = %${obj.pattern}%` ).join(', ')}`;
};