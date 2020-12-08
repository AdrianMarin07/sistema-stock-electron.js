const Type = require('./Type');

class Product {
    constructor( data) {
        if(data.id) this.id = data.id;
        this.type = new Type(data.type);
        this.detail = data.detail;
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

}

module.exports = Product;
