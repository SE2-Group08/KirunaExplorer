package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.validation.annotation.OneOfGeoReference;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

@OneOfGeoReference
public record GeoReferenceDTO(
    @DecimalMin(value = "67.3564329180828")
    @DecimalMax(value = "69.05958911620179")
    Double latitude,  // Latitude as a Double to match the "number" type

    @DecimalMin(value = "17.89900836116174")
    @DecimalMax(value = "23.28669305841499")
    Double longitude,  // Longitude as a Double to match the "number" type

    @Size(min = 2, max = 64)
    String municipality  // To match the string type with pattern and length constraints
) {
    /***
     * Converts the GeoReferenceDTO to a GeoReference object.
     * @param document Document reference
     * @return GeoReference object
     */
    public GeoReference toGeoReference(Document document) {
        return new GeoReference(
            document,
            municipality != null,
            (latitude != null && longitude != null) ? createPoint(latitude, longitude) : null
        );
    }

    public Point createPoint(Double latitude, Double longitude) {
        return new GeometryFactory().createPoint(new Coordinate(
            longitude, latitude
        ));
    }
}
