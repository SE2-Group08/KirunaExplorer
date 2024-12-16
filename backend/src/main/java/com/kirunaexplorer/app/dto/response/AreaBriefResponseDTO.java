package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;

public record AreaBriefResponseDTO(
    Long id,
    String name,
    CoordinatesDTO centroid
) {
}
