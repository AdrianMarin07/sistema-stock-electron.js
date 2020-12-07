const Product = require('./Product');

class Record {


    constructor( data ) {
        if(data.id) this.id = data.id;
        this.product = new Product(data.product);
        this.date = data.date;
        this.transaction = data.transaction;
        this.quantity = data.quantity;
    }

    get _id () {
        return this.id ? this.id : 0;
    }

    get _product() {
        return this.product;
    }

    get _date() {
        return this.date;
    }

    get _transaction() {
        return this.transaction;
    }

    get _quantity() {
        return this.quantity;
    }
}

module.exports = Record;
