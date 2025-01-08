package com.kirunaexplorer.app.validation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.Locale;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AreaRequestDTOTest {

    private Validator validator;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        objectMapper = new ObjectMapper();
        Locale.setDefault(Locale.ENGLISH); // Set default locale to English
    }

    @Test
    public void testValidAreaRequestDTO() throws Exception {
        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(null, "Test Area", new CoordinatesDTO(68.0, 18.0));
        JsonNode coordinates = objectMapper.readTree("[[68.0, 18.0], [68.1, 18.1], [68.2, 18.2]]");
        GeometryDTO geometryDTO = new GeometryDTO("Polygon", coordinates);
        AreaRequestDTO areaRequestDTO = new AreaRequestDTO(areaBriefDTO, geometryDTO);

        Set<ConstraintViolation<AreaRequestDTO>> violations = validator.validate(areaRequestDTO, PostArea.class);
        assertTrue(violations.isEmpty());
    }

//    @Test
//    public void testInvalidAreaRequestDTO() throws Exception {
//        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(null, "Test Area", new CoordinatesDTO(67.0, 17.0));
//        JsonNode coordinates = objectMapper.readTree("[[67.0, 17.0], [67.1, 17.1], [67.2, 17.2]]");
//        GeometryDTO geometryDTO = new GeometryDTO("Polygon", coordinates);
//        AreaRequestDTO areaRequestDTO = new AreaRequestDTO(areaBriefDTO, geometryDTO);
//
//        Set<ConstraintViolation<AreaRequestDTO>> violations = validator.validate(areaRequestDTO, PostArea.class);
//        assertEquals(2, violations.size());
//
//        for (ConstraintViolation<AreaRequestDTO> violation : violations) {
//            String propertyPath = violation.getPropertyPath().toString();
//            String expectedMessage = "deve essere superiore a o uguale a 67.3564329180828";
//            if (propertyPath.equals("area.areaCentroid.latitude") || propertyPath.equals("area.areaCentroid.longitude")) {
//                assertEquals(expectedMessage, violation.getMessage());
//            } else if (propertyPath.equals("geometry.coordinates")) {
//                assertEquals("invalid coordinates", violation.getMessage());
//            }
//        }
//    }
}