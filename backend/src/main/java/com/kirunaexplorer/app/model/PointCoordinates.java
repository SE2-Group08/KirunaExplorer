package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;
import com.kirunaexplorer.app.dto.response.PointCoordinatesResponseDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "POINT_COORDINATES")
public class PointCoordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double latitude;
    private Double longitude;

    public PointCoordinatesResponseDTO toPointCoordinatesResponseDTO() {
        return new PointCoordinatesResponseDTO(id, name, latitude, longitude);
    }

    public PointCoordinatesDTO toPointCoordinatesDTO() {
        return new PointCoordinatesDTO(id, name, latitude, longitude);
    }
}
