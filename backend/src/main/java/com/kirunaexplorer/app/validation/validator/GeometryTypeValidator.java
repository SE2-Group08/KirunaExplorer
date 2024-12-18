package com.kirunaexplorer.app.validation.validator;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.validation.annotation.ValidGeometryType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.stream.Collectors;

public class GeometryTypeValidator implements ConstraintValidator<ValidGeometryType, String> {

    private String allowedValues;

    @Override
    public void initialize(ValidGeometryType constraintAnnotation) {
        allowedValues = Arrays.stream(GeometryType.values())
            .map(Enum::name)
            .collect(Collectors.joining(", "));
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // @NotNull should handle null values
        }

        boolean isValid = Arrays.stream(GeometryType.values())
            .anyMatch(geometryType -> geometryType.name().equalsIgnoreCase(value));

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "Invalid geometry type. Allowed types are: " + allowedValues
            ).addConstraintViolation();
        }

        return isValid;
    }
}