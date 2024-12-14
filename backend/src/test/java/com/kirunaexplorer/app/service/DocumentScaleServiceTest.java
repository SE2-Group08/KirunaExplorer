package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class DocumentScaleRequestDTOTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidRequest() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "Valid Scale");

        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        assertTrue(violations.isEmpty());
    }

    @Test
    void testInvalidScaleTooShort() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "1");

        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertEquals("Too short scale", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidScaleTooLong() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "A".repeat(65));

        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertEquals("Too long scale", violations.iterator().next().getMessage());
    }

    @Test
    void testNullScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, null);

        Set<ConstraintViolation<DocumentScaleRequestDTO>> violations = validator.validate(request, PostDocumentScale.class);

        assertFalse(violations.isEmpty());
        assertEquals("scale must be not null", violations.iterator().next().getMessage());
    }
}
