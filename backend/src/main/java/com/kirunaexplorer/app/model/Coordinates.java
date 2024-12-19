package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coordinates {
    private Double latitude;
    private Double longitude;

    /**
     * Convert Coordinates to CoordinatesDTO
     *
     * @return CoordinatesDTO
     */
    public CoordinatesDTO toCoordinatesDTO() {
        return new CoordinatesDTO(latitude, longitude);
    }
}
