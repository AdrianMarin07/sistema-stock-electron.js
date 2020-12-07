class Type {
    constructor( brand, name, id) {
        if(id) this.id = id;
        this.brand = brand;
        this.name = name;
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
