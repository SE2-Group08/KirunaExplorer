export class User {
    constructor(id, username, role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    static fromJson(json) {
        return new User(json.id, json.username, json.role);
    }
}

export default User;