package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.PointCoordinates;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PointCoordinatesDTO(
    Long pointId,

    @NotNull
    @Size(min = 2, max = 64)
    String pointName,

    CoordinatesDTO coordinates
) {

    public PointCoordinatesDTO(Long pointId, String pointName, double latitude, double longitude) {
        this(pointId, pointName, new CoordinatesDTO(latitude, longitude));
    }

    public PointCoordinates toPointCoordinates() {
        return new PointCoordinates(null, pointName, coordinates.latitude(), coordinates.longitude());
    }
}
