package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.PointCoordinates;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PointCoordinatesRequestDTO(
    @NotNull
    @Size(min = 2, max = 64)
    String pointName,

    @DecimalMin(value = "67.3564329180828")
    @DecimalMax(value = "69.05958911620179")
    Double latitude,

    @DecimalMin(value = "17.89900836116174")
    @DecimalMax(value = "23.28669305841499")
    Double longitude
) {
    public PointCoordinates toPointCoordinates() {
        return new PointCoordinates(null, pointName, latitude, longitude);
    }
}
