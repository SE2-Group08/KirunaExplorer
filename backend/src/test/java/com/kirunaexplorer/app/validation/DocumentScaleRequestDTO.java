package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

class DocumentScaleRequestDTOTest {

    private static Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
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

    @Test
    void testValidScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "Valid Scale");

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "id"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("id"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("No error", errorMessage);
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

}
