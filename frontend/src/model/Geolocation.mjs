export class GeolocatedPoint {
  constructor(pointId, pointName, coordinates) {
    this.pointId = pointId;
    this.pointName = pointName;
    this.coordinates = coordinates;
  }

  static fromJSON(json) {
    return new GeolocatedPoint(json.pointId, json.pointName, json.coordinates);
  }
}

export class GeolocatedAreaSnippet {
  constructor(areaId, areaName, areaCentroid) {
    this.areaId = areaId;
    this.areaName = areaName;
    this.areaCentroid = areaCentroid;
  }

  static fromJSON(json) {
    return new GeolocatedAreaSnippet(
      json.areaId,
      json.areaName,
      json.areaCentroid
    );
  }
}

export class GeolocatedAreaGeometry {
  constructor(id, name, centroid, geometry) {
    this.id = id;
    this.name = name;
    this.centroid = centroid;
    this.geometry = geometry;
  }

  static fromJSON(json) {
    return new GeolocatedAreaGeometry(
      json.id,
      json.name,
      json.centroid,
      json.geometry
    );
  }
}
