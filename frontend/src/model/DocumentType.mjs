export class DocumentType {
    constructor(id, name) {
        this.id = id;
        this.name = name;  
    }

    static fromJSON(json) {
        return new DocumentType(json.id, json.type_name);
    }
  }
  
  export default { DocumentType };