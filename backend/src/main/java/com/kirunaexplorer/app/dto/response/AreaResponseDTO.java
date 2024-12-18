package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.model.Coordinates;

import java.util.List;

public record AreaResponseDTO(
    Long id,
    String name,
    CoordinatesDTO centroid,
    GeometryDTO geometry
) {
}
