package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.model.Stakeholder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StakeholderRequestDTOTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidStakeholderRequestDTO() {
        StakeholderRequestDTO dto = new StakeholderRequestDTO(null, "Valid Name");

        Set<ConstraintViolation<StakeholderRequestDTO>> violations = validator.validate(dto);

        assertTrue(violations.isEmpty());
    }

    @Test
    void testInvalidIdNotNull() {
        StakeholderRequestDTO dto = new StakeholderRequestDTO(1L, "Valid Name");

        Set<ConstraintViolation<StakeholderRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("id must be null", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidNameNull() {
        StakeholderRequestDTO dto = new StakeholderRequestDTO(null, null);

        Set<ConstraintViolation<StakeholderRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("name must be not null", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidNameSize() {
        StakeholderRequestDTO dto = new StakeholderRequestDTO(null, "A");

        Set<ConstraintViolation<StakeholderRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("size error", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidNameSizeTooLong() {
        String longName = "A".repeat(65);
        StakeholderRequestDTO dto = new StakeholderRequestDTO(null, longName);

        Set<ConstraintViolation<StakeholderRequestDTO>> violations = validator.validate(dto);

        assertEquals(1, violations.size());
        assertEquals("size error", violations.iterator().next().getMessage());
    }

    @Test
    void testToStakeholder() {
        StakeholderRequestDTO dto = new StakeholderRequestDTO(null, "Valid Name");

        Stakeholder stakeholder = dto.toStakeholder();

        assertEquals("Valid Name", stakeholder.getName());
    }
}
