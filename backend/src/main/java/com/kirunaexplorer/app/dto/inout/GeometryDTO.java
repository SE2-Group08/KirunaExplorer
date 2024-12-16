package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.model.Coordinates;
import com.kirunaexplorer.app.model.Geometry;

import java.util.List;

public record GeometryDTO(
    String type,
    List<CoordinatesDTO> coordinates
) {

    /**
     * Convert to Geometry.
     *
     * @return Geometry
     */
    public Geometry toGeometry() {
        GeometryType geometryType = GeometryType.valueOf(type.toUpperCase());
        List<Coordinates> coords = coordinates.stream().map(CoordinatesDTO::toCoordinates).toList();

        return new Geometry(geometryType, coords);
    }
}
