exports.select = (db) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT record.id AS record_id, record.transaction_type , record.date , record.quantity , record.fk_product , product.details , product.quantity AS total, product.fk_type , type.name AS type_name, type.fk_brand , brand.name AS brand_name FROM product INNER JOIN record on product.id = record.fk_product INNER JOIN type on product.fk_type = type.id INNER JOIN brand on type.fk_brand = brand.id WHERE record.id = (SELECT MAX(id) FROM record WHERE fk_product=product.id)`,
       [], (err, rows) => {
        if (err) reject(err.message);
  
        resolve(rows);
      });
    });
  };