package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.response.AreaBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.AreaResponseDTO;
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
@Table(name = "AREA")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Embedded
    private Coordinates centroid;

    @Embedded
    private Geometry geometry;


    /**
     * Convert Area to AreaBriefResponseDTO
     *
     * @return AreaBriefResponseDTO
     */
    public AreaBriefResponseDTO toAreaBriefResponseDTO() {
        return new AreaBriefResponseDTO(id, name, centroid.toCoordinatesDTO());
    }

    /**
     * Convert Area to AreaResponseDTO
     *
     * @return AreaResponseDTO
     */
    public AreaResponseDTO toAreaResponseDTO() {
        return new AreaResponseDTO(id, name, centroid.toCoordinatesDTO(), geometry.toGeometryDTO());
    }

    public AreaBriefDTO toAreaBriefDTO() {
        return new AreaBriefDTO(id, name, centroid.toCoordinatesDTO());
    }
}
