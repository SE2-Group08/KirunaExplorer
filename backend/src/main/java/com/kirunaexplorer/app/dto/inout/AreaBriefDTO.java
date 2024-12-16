package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Area;

public record AreaBriefDTO(
    Long areaId,
    String areaName,
    CoordinatesDTO areaCentroid
) {
    public Area toArea() {
        return new Area(
            areaId,
            areaName,
            areaCentroid.toCoordinates(),
            null
        );
    }
}
