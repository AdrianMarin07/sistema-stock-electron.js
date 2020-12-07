const Brand = require('./Brand');
const Type = require('./Type');
const Product = require('./Product');
const Record = require('./Record');

const marca = new Brand(0, 'nivea');
const tipo = new Type(marca, 'Shampoo', 10);
const producto = new Product(tipo, "Para cabello seco", 20, 2);
const historia = new Record(producto, "20/10/2020 21:30:54", true, 5, 1);

const log = 
`
marca: id-${historia.product.type.brand._name} nombre-${historia.product.type.brand._id}
tipo: nombre-${historia.product.type._name} id-${historia.product.type._id}
producto: detalle-'${historia.product._detail}' cantidad-${historia.product._quantity} id-${historia.product._id}
historia: fecha-'${historia._date}' transaccion-${historia._transaction} cantidad-${historia._quantity} id-${historia._id}
`;

console.log(log);