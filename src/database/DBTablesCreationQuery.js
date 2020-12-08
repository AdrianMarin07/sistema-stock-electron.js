module.exports = 
`CREATE TABLE brand (
    id INTEGER PRIMARY KEY,
    name varchar(35) NOT NULL
  );

  CREATE TABLE type (
    id INTEGER PRIMARY KEY,
    name varchar(35) NOT NULL,
    fk_brand int(11) NOT NULL
  );
  
  CREATE TABLE product (
    id INTEGER PRIMARY KEY,
    details varchar(500) NOT NULL,
    fk_type int(11) NOT NULL
  );
  
  CREATE TABLE record (
    id INTEGER PRIMARY KEY,
    transaction_type int(1) NOT NULL,
    date varchar(20) NOT NULL,
    quantity int(3),
    fk_product int(11) NOT NULL
  );
  `;
