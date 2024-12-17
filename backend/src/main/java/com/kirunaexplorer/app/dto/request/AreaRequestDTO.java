package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.model.Area;
import com.kirunaexplorer.app.validation.groups.area.PostArea;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AreaRequestDTO(
    @Valid
    @NotNull(groups = {PostArea.class})
    AreaBriefDTO area,

    @Valid
    @NotNull(groups = {PostArea.class})
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
