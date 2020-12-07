class Record {


    constructor( product, date, transaction, quantity, id ) {
        if(id) this.id = id;
        this.product = product;
        this.date = date;
        this.transaction = transaction;
        this.quantity = quantity;
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
