class User {
    constructor(data) {
        if (data.id) this.id = data.id;
        this.name = data.name;
        this.lastName = data.lastName;
        if (data.eMail) this.eMail = data.eMail;
        this.user = data.user;
        this.password = data.pasword;
        this.type = data.type;
    }

    get _id() {
        return this.id || 0;
    }

    get _name() {
        return this.name;
    }

    get _lastName() {
        return this.lastName;
    }

    get _eMail() {
        return this.eMail || "None";
    }

    get _user() {
        return this.user;
    }

    get _password() {
        return this.password;
    }   

    get _type(){
        return this.type;
    }
}

module.exports = User;