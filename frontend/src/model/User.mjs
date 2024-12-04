export class User {
    static Role = Object.freeze({
        URBAN_PLANNER: "URBAN_PLANNER",
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
