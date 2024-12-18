package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.dto.request.AreaRequestDTO;
import com.kirunaexplorer.app.validation.groups.area.PostArea;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AreaRequestDTOTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidAreaRequestDTO() {
        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(null, "Test Area", new CoordinatesDTO(68.0, 18.0));
        GeometryDTO geometryDTO = new GeometryDTO("Polygon", List.of(
                new CoordinatesDTO(68.0, 18.0),
                new CoordinatesDTO(68.1, 18.1),
                new CoordinatesDTO(68.2, 18.2)
        ));
        AreaRequestDTO areaRequestDTO = new AreaRequestDTO(areaBriefDTO, geometryDTO);

        Set<ConstraintViolation<AreaRequestDTO>> violations = validator.validate(areaRequestDTO, PostArea.class);
        System.out.println(violations);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidAreaRequestDTO() {
        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(null, "Test Area", new CoordinatesDTO(67.0, 17.0));
        GeometryDTO geometryDTO = new GeometryDTO("Polygon", List.of(
                new CoordinatesDTO(67.0, 17.0),
                new CoordinatesDTO(67.1, 17.1),
                new CoordinatesDTO(67.2, 17.2)
        ));
        AreaRequestDTO areaRequestDTO = new AreaRequestDTO(areaBriefDTO, geometryDTO);

        Set<ConstraintViolation<AreaRequestDTO>> violations = validator.validate(areaRequestDTO, PostArea.class);
        violations.forEach(violation -> {
            String propertyPath = violation.getPropertyPath().toString();
            if (propertyPath.equals("geometry.coordinates[1].longitude") ||
                    propertyPath.equals("geometry.coordinates[0].longitude") ||
                    propertyPath.equals("geometry.coordinates[2].longitude") ||
                    propertyPath.equals("area.areaCentroid.longitude")) {
                assertEquals("deve essere superiore a o uguale a 17.89900836116174", violation.getMessage());
            } else if (propertyPath.equals("geometry.coordinates[1].latitude") ||
                    propertyPath.equals("geometry.coordinates[2].latitude") ||
                    propertyPath.equals("geometry.coordinates[0].latitude") ||
                    propertyPath.equals("area.areaCentroid.latitude")) {
                assertEquals("deve essere superiore a o uguale a 67.3564329180828", violation.getMessage());
            } else if (propertyPath.equals("area.areaId")) {
                assertEquals("deve essere null", violation.getMessage());
            }
        });
        assertEquals(8, violations.size());

    }
}
