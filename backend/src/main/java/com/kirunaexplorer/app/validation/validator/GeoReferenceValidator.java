package com.kirunaexplorer.app.validation.validator;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.validation.annotation.ValidGeoReference;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class GeoReferenceValidator implements ConstraintValidator<ValidGeoReference, GeoReferenceDTO> {

    @Override
    public boolean isValid(GeoReferenceDTO value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // @NotNull should handle null values
        }

        boolean isValid = value.area() == null || value.pointCoordinates() == null;

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "Both area and pointCoordinates cannot have values at the same time"
            ).addConstraintViolation();
        }

        return isValid;
    }
}