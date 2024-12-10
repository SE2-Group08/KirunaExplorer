package com.kirunaexplorer.app.validation.validator;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.validation.annotation.OneOfGeoReference;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OneOfGeoReferenceValidator implements ConstraintValidator<OneOfGeoReference, GeoReferenceDTO> {

    @Override
    public boolean isValid(GeoReferenceDTO geoReferenceDTO, ConstraintValidatorContext context) {
        if (geoReferenceDTO == null) {
            return true; // Null check is optional and handled elsewhere if needed
        }

        boolean isCoordinateValid = geoReferenceDTO.latitude() != null && geoReferenceDTO.longitude() != null
            && geoReferenceDTO.municipality() == null;

        boolean isMunicipalityValid = geoReferenceDTO.latitude() == null && geoReferenceDTO.longitude() == null
            && geoReferenceDTO.municipality() != null;

        boolean isAllNull = geoReferenceDTO.latitude() == null && geoReferenceDTO.longitude() == null
            && geoReferenceDTO.municipality() == null;

        // Valid if all fields are null, or one of the specified conditions is met
        return isAllNull || isCoordinateValid || isMunicipalityValid;
    }
}
