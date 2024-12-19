export class Document {
  constructor(
    id,
    title,
    stakeholders,
    scale,
    issuanceDate,
    type,
    nrConnections,
    language,
    nrPages,
    geolocation,
    description
  ) {
    this.id = id;
    this.title = title;
    this.stakeholders = stakeholders;
    this.scale = scale;
    this.issuanceDate = issuanceDate || "-";
    this.type = type;
    this.nrConnections = nrConnections;
    this.language = language;
    this.nrPages = nrPages;
    this.geolocation = geolocation;
    this.description = description;
  }
}

export class DocumentSnippet {
  constructor(
    id,
    title,
    scale,
    issuanceDate,
    type,
    geolocation,
    stakeholders
  ) {
    this.id = id;
    this.title = title;
    this.scale = scale;
    this.issuanceDate = issuanceDate || "-";
    this.type = type;
    this.geolocation = geolocation;
    this.stakeholders = stakeholders;
  }
}

export default { Document, DocumentSnippet };
