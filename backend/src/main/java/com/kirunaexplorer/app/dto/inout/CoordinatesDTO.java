package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Coordinates;
import com.kirunaexplorer.app.validation.groups.area.PostArea;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record CoordinatesDTO(
    @DecimalMin(value = "67.3564329180828", groups = {PostArea.class})
    @DecimalMax(value = "69.05958911620179", groups = {PostArea.class})
    @NotNull(groups = {PostArea.class})
    Double latitude,

    @DecimalMin(value = "17.89900836116174", groups = {PostArea.class})
    @DecimalMax(value = "23.28669305841499", groups = {PostArea.class})
    @NotNull(groups = {PostArea.class})
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
