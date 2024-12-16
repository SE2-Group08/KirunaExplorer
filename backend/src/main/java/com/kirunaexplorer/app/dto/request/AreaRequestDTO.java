package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.model.Area;

public record AreaRequestDTO(
    AreaBriefDTO area,
    GeometryDTO geometry
) {
    /**
     * Convert to Area.
     *
     * @return Area
     */
    public Area toArea() {
        return new Area(area.areaId(), area.areaName(), area.areaCentroid().toCoordinates(), geometry.toGeometry());
    }
}
