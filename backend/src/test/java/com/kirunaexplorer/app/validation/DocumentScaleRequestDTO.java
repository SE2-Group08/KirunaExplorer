package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DocumentScaleRequestDTOTest {

    private ValidatorFactory factory;
    private Validator validator;

    @BeforeEach
    void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterEach
    void tearDown() {
        if (factory != null) {
            factory.close();
        }
    }

    @Test
    void testValidScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "Valid Scale");

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Assicurati che non ci siano violazioni
        assertEquals(0, violations.size());
    }

    @Test
    void testNullScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, null);

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "scale"
        String scaleErrorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("scale must be not null", scaleErrorMessage);
    }

    @Test
    void testToDocumentScale() {
        // Arrange: Create a valid DocumentScaleRequestDTO
        Long expectedId = 1L;
        String expectedScale = "Test Scale";
        DocumentScaleRequestDTO requestDTO = new DocumentScaleRequestDTO(expectedId, expectedScale);

        // Act: Convert it to DocumentScale
        DocumentScale documentScale = requestDTO.toDocumentScale();

        // Assert: Verify that the fields are correctly mapped
        assertEquals(expectedId, documentScale.getId());
        assertEquals(expectedScale, documentScale.getScale());
    }

    @Test
    void testInvalidScaleTooShort() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "A");

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request);

        // Recupera il messaggio di errore per il campo "scale"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("Too short scale", errorMessage);
    }

    @Test
    void testInvalidScaleTooLong() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "A".repeat(65));

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request);

        // Recupera il messaggio di errore per il campo "scale"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("Too long scale", errorMessage);
    }

}
