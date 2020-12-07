class Product {
    constructor( data) {
        if(data.id) this.id = data.id;
        this.type = data.type;
        this.detail = data.detail;
        this.quantity = data.quantity;
    }

    get _id() {
        return this.id ? this.id : 0;
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
}

module.exports = Product;
