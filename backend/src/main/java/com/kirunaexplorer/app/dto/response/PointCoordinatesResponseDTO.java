package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;

public record PointCoordinatesResponseDTO(
    PointCoordinatesDTO pointCoordinates
) {
    public PointCoordinatesResponseDTO(Long id, String pointName, Double latitude, Double longitude) {
        this(new PointCoordinatesDTO(id, pointName, latitude, longitude));
    }
}
