export class User {
    constructor(id, username, password, role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    static fromJson(json) {
        return new User(json.id, json.username, json.password);
    }
}

export default User;