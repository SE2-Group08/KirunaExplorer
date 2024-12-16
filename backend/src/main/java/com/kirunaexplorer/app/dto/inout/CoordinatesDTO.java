package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Coordinates;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

public record CoordinatesDTO(
    @DecimalMin(value = "67.3564329180828")
    @DecimalMax(value = "69.05958911620179")
    Double latitude,

    @DecimalMin(value = "17.89900836116174")
    @DecimalMax(value = "23.28669305841499")
    Double longitude
) {
    /**
     * Convert to Coordinates.
     *
     * @return Coordinates
     */
    public Coordinates toCoordinates() {
        return new Coordinates(latitude, longitude);
    }
}
