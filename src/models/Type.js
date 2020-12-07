class Type {
    constructor( data ) {
        if(data.id) this.id = data.id;
        this.brand = data.brand;
        this.name = data.name;
    }

    get _id() {
        return this.id ? this.id : 0;
    }

    get _brand() {
        return this.brand;
    }

    get _name() {
        return this.name;
    }
}

module.exports = Type;
