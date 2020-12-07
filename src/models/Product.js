class Product {
    constructor( type, detail, quantity, id) {
        if(id) this.id = id;
        this.type = type;
        this.detail = detail;
        this.quantity = quantity;
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
