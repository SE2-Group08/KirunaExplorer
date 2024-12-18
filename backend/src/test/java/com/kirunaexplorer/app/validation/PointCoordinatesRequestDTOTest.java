package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;
import com.kirunaexplorer.app.dto.request.PointCoordinatesRequestDTO;
import com.kirunaexplorer.app.model.PointCoordinates;
import com.kirunaexplorer.app.validation.groups.point_coordinates.PostPointCoordinates;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PointCoordinatesRequestDTOTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testToPointCoordinates() {
        PointCoordinatesDTO pointCoordinatesDTO = new PointCoordinatesDTO(null, "Test Point", new CoordinatesDTO(68.2, 19.2));
        PointCoordinatesRequestDTO requestDTO = new PointCoordinatesRequestDTO(pointCoordinatesDTO);

        PointCoordinates pointCoordinates = requestDTO.toPointCoordinates();
        assertEquals("Test Point", pointCoordinates.getName());
        assertEquals(68.2, pointCoordinates.getCoordinates().getLatitude());
        assertEquals(19.2, pointCoordinates.getCoordinates().getLongitude());
    }

    @Test
    void testValidation() {
        // Missing pointCoordinates should cause validation failure
        PointCoordinatesRequestDTO requestDTO = new PointCoordinatesRequestDTO(null);
        var violations = validator.validate(requestDTO, PostPointCoordinates.class);
        assertFalse(violations.isEmpty());

        // Valid DTO should not cause any violations
        PointCoordinatesDTO pointCoordinatesDTO = new PointCoordinatesDTO(null, "Test Point", new CoordinatesDTO(68.2, 19.2));
        requestDTO = new PointCoordinatesRequestDTO(pointCoordinatesDTO);
        violations = validator.validate(requestDTO, PostPointCoordinates.class);
        assertTrue(violations.isEmpty());
    }
}
