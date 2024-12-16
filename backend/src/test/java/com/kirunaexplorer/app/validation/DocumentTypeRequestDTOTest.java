package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.validation.groups.document_type.PostDocumentType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DocumentTypeRequestDTOTest {

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
    void testValidDocumentTypeRequestDTO() {
        DocumentTypeRequestDTO dto = new DocumentTypeRequestDTO(null, "Valid Name");

        Set<ConstraintViolation<DocumentTypeRequestDTO>> violations = validator.validate(dto, PostDocumentType.class);

        assertEquals(0, violations.size());
    }

    @Test
    void testInvalidNameTooShort() {
        DocumentTypeRequestDTO dto = new DocumentTypeRequestDTO(null, "A");

        Set<ConstraintViolation<DocumentTypeRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("size must be between 2 and 64", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidNameTooLong() {
        DocumentTypeRequestDTO dto = new DocumentTypeRequestDTO(null, "A".repeat(65));

        Set<ConstraintViolation<DocumentTypeRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("size must be between 2 and 64", violations.iterator().next().getMessage());
    }

    @Test
    void testNullIdValidation() {
        DocumentTypeRequestDTO dto = new DocumentTypeRequestDTO(1L, "Valid Name");

        Set<ConstraintViolation<DocumentTypeRequestDTO>> violations = validator.validate(dto, PostDocumentType.class);

        assertEquals(1, violations.size());
        assertEquals("must be null", violations.iterator().next().getMessage());
    }

    @Test
    void testToDocumentTypeConversion() {
        DocumentTypeRequestDTO dto = new DocumentTypeRequestDTO(null, "Test Name");
        DocumentType documentType = dto.toDocumentType();

        assertEquals("Test Name", documentType.getTypeName());
        assertEquals(null, documentType.getId());
    }
}
