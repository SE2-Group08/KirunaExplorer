package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.model.Area;

public record AreaRequestDTO(
    Long areaId,
    String areaName,
    CoordinatesDTO centroid,
    GeometryDTO geometry
) {
    /**
     * Convert to Area.
     *
     * @return Area
     */
    public Area toArea() {
        return new Area(areaId, areaName, centroid.toCoordinates(), geometry.toGeometry());
    }
}
