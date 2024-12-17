export class GeolocatedPoint {
  constructor(id, name, latitude, longitude) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static fromJSON(json) {
    return new GeolocatedPoint(
      json.id,
      json.name,
      json.coordinates.latitude,
      json.coordinates.longitude
    );
  }
}
