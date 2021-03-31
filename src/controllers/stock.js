exports.select = (db) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT product.id AS id_product, record.id AS record_id, record.transaction_type , record.date , record.quantity , record.fk_product , product.details , product.quantity AS total, product.fk_type , type.name AS type_name, product.fk_brand , brand.name AS brand_name FROM product LEFT JOIN record on product.id = record.fk_product INNER JOIN type on product.fk_type = type.id INNER JOIN brand on product.fk_brand = brand.id WHERE record.id = (SELECT MAX(id) FROM record WHERE fk_product=product.id) OR id_product NOT IN (SELECT fk_product FROM record)`,
       [], (err, rows) => {
        if (err) return reject(err.message);
        resolve(rows);
      });
    });
  };

  exports.selectPurchaseList = (db) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT product.details, product.min_quantity, product.barcode, product.quantity AS total, product.fk_type , type.name AS type_name, product.fk_brand , brand.name AS brand_name FROM product INNER JOIN type on product.fk_type = type.id INNER JOIN brand on product.fk_brand = brand.id WHERE product.quantity < product.min_quantity`,
       [], (err, rows) => {
        if (err) return reject(err.message);
        resolve(rows);
      });
    });
  };