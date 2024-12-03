export class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static fromJson(json) {
        return new User(json.id, json.username, json.password);
    }
}

export default User;