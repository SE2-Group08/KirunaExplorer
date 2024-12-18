package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.model.Coordinates;
import com.kirunaexplorer.app.model.Geometry;
import com.kirunaexplorer.app.validation.annotation.ValidGeometryType;
import com.kirunaexplorer.app.validation.groups.area.PostArea;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GeometryDTO(
    @NotNull(groups = {PostArea.class})
    @ValidGeometryType(groups = {PostArea.class})
    String type,

    @NotNull(groups = {PostArea.class})
    @Valid
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
