class Brand {

    constructor ( name , id) {
        if(id) this.id = id;
        this.name = name;
    };

    get _id() {
        return this.id ? this.id : 0;
    }

    get _name() {
        return this.name;
    }

}

module.exports = Brand;
