package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;

public record AreaBriefResponseDTO(
    AreaBriefDTO area
) {
    public AreaBriefResponseDTO(Long areaId, String areaName, CoordinatesDTO areaCentroid) {
        this(new AreaBriefDTO(areaId, areaName, areaCentroid));
    }
}
