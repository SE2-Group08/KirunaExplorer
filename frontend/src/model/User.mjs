vexport class User {
    static Role = Object.freeze({
        ADMIN: "ADMIN",
        USER: "USER",
        GUEST: "GUEST", // Add roles as needed
    });

    constructor(id, username, role) {
        if (!Object.values(User.Role).includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        this.id = id;
        this.username = username;
        this.role = role;
    }

    static fromJson(json) {
        return new User(json.id, json.username, json.role);
    }

    hasRole(requiredRole) {
        return this.role === requiredRole;
    }
}

export default User;
