module.exports = class UserClear {
    name;
    id;
    constructor(params){
        this.username = params.username;
        this.id = params._id;
    }
}
