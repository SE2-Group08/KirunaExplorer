package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Geometry {

    private GeometryType type;

    @ElementCollection
    private List<Object> coordinates;

    /**
     * Convert to GeometryDTO.
     *
     * @return GeometryDTO
     */
    public GeometryDTO toGeometryDTO() {
        return new GeometryDTO(type.name(), coordinates);
    }
}
