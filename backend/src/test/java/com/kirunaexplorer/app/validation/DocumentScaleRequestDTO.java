package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

class DocumentScaleRequestDTOTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testInvalidScaleTooShort() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "A");

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "scale"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("invalid size for scale", errorMessage);
    }

    @Test
    void testInvalidScaleTooLong() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "A".repeat(65));

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "scale"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("invalid size for scale", errorMessage);
    }

    @Test
    void testValidScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(1L, "Valid Scale");

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "id"
        String errorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("id"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("id must be not null", errorMessage);
    }

    @Test
    void testNullScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, null);

        // Validation with the PostDocumentScale group
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera il messaggio di errore per il campo "id"
        String idErrorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("id"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Recupera il messaggio di errore per il campo "scale"
        String scaleErrorMessage = violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("scale"))
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("No error");

        // Verifica che il messaggio di errore sia quello atteso
        assertEquals("id must be not null", idErrorMessage);
        assertEquals("scale must be not null", scaleErrorMessage);
    }

    @Test
    void testMultipleViolations() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(1L, "A");

        // Validazione con il gruppo PostDocumentScale
        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        // Recupera tutti i messaggi di errore dal vettore delle violazioni
        String errorMessages = violations.stream()
                .map(ConstraintViolation::getMessage)
                .reduce((msg1, msg2) -> msg1 + ", " + msg2)
                .orElse("No errors");

        // Verifica che siano presenti i messaggi di errore attesi
        assertTrue(errorMessages.contains("id must be not null"));
        assertTrue(errorMessages.contains("invalid size for scale"));
    }
}
