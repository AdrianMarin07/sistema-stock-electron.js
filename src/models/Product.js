const Type = require('./Type');
const Brand = require('./Brand');

class Product {
    constructor( data) {
        if(data.id) this.id = data.id;
        this.brand = new Brand(data.brand);
        this.type = new Type(data.type);
        this.quantity = data.quantity;
        this.detail = data.detail;
        this.price = data.price;
        this.barcode = data.barcode;
        this.minQuantity = data.minQuantity;
    }

    get _id() {
        return this.id ? this.id : 0;
    }

    get _brand() {
        return this.brand;
    }

    get _type() {
        return this.type;
    }

    get _detail() {
        return this.detail;
    }

    get _quantity() {
        return this.quantity;
    }

    get _price() {
        return this.price;
    }

    get _barcode() {
        return this.barcode;
    }

    get _minQuantity() {
        return this.minQuantity;
    }
}

module.exports = Product;
