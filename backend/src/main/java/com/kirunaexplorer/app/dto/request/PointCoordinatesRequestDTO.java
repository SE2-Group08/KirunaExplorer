package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;
import com.kirunaexplorer.app.model.PointCoordinates;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PointCoordinatesRequestDTO(
    PointCoordinatesDTO pointCoordinates
) {
    public PointCoordinates toPointCoordinates() {
        return new PointCoordinates(
            null,
            pointCoordinates.pointName(),
            pointCoordinates.coordinates().latitude(),
            pointCoordinates.coordinates().longitude()
        );
    }
}
