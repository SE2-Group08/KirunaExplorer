package com.kirunaexplorer.app.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import jakarta.persistence.*;
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

    @Lob
    @Basic(fetch = FetchType.EAGER)
    private String coordinates;

    /**
     * Convert to GeometryDTO.
     *
     * @return GeometryDTO
     */
    public GeometryDTO toGeometryDTO() {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode coordinatesNode;
        try {
            coordinatesNode = mapper.readTree(coordinates);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse coordinates JSON", e);
        }
        return new GeometryDTO(type.name(), coordinatesNode);
    }


    /**
     * Set coordinates from JsonNode.
     *
     * @param coordinatesNode JsonNode
     */
    public void setCoordinates(JsonNode coordinatesNode) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            this.coordinates = mapper.writeValueAsString(coordinatesNode);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert coordinates to JSON", e);
        }
    }
}
