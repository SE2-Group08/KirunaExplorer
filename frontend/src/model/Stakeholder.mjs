/*Stakeholder class*/
class Stakeholder {
    constructor(id, name ) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(json) {
        return new Stakeholder(json.id, json.name);
    }
}

export default Stakeholder;
