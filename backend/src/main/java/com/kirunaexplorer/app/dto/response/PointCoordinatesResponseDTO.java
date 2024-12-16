package com.kirunaexplorer.app.dto.response;

public record PointCoordinatesResponseDTO(
    Long id,
    String pointName,
    Double latitude,
    Double longitude
) {
}
