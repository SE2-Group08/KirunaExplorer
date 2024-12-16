package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Coordinates;

public record CoordinatesDTO(
    Double latitude,
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
