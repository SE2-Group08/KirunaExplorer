package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.validation.groups.link.PostLink;
import com.kirunaexplorer.app.validation.groups.link.PutLink;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LinkDocumentsRequestDTOValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidPostLinkRequest() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, 1L);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PostLink.class);

        assertTrue(violations.isEmpty(), "Expected no validation errors for a valid PostLink request");
    }

   /* @Test
    void testInvalidPostLinkRequest_MissingType() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(null, null, 1L);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PostLink.class);

        assertEquals(1, violations.size());
        assertEquals("{link.type.invalid}", violations.iterator().next().getMessage());
    }*/

    @Test
    void testInvalidPostLinkRequest_LinkIdNotNull() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, 10L, 1L);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PostLink.class);

        assertEquals(1, violations.size());
        assertEquals("deve essere null", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidPostLinkRequest_DocumentIdNull() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, null);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PostLink.class);

        assertEquals(1, violations.size());
        assertEquals("non deve essere null", violations.iterator().next().getMessage());
    }

    @Test
    void testValidPutLinkRequest() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, 10L, null);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PutLink.class);

        assertTrue(violations.isEmpty(), "Expected no validation errors for a valid PutLink request");
    }

   /* @Test
    void testInvalidPutLinkRequest_TypeNull() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(null, 10L, null);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PutLink.class);

        assertEquals(1, violations.size());
        assertEquals("link.type.invalid", violations.iterator().next().getMessage());
    }*/

    @Test
    void testInvalidPutLinkRequest_LinkIdNull() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, null);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PutLink.class);

        assertEquals(1, violations.size());
        assertEquals("non deve essere null", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidPutLinkRequest_DocumentIdNotNull() {
        LinkDocumentsRequestDTO dto = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, 10L, 1L);
        Set<ConstraintViolation<LinkDocumentsRequestDTO>> violations = validator.validate(dto, PutLink.class);

        assertEquals(1, violations.size());
        assertEquals("deve essere null", violations.iterator().next().getMessage());
    }
}
