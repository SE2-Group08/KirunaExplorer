package com.kirunaexplorer.app.validation.annotation;

import com.kirunaexplorer.app.validation.validator.GeoReferenceValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = GeoReferenceValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidGeoReference {
    String message() default "Both area and pointCoordinates cannot have values at the same time";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}