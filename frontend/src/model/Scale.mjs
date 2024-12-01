export class Scale {
    constructor(id, name) {
        this.id = id;
        this.name = name;  
    }

    static fromJSON(json) {
        return new Scale(json.id, json.name);
    }
  }
  
  export default { Scale };