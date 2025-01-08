package com.kirunaexplorer.app.validation.annotation;

import com.kirunaexplorer.app.validation.validator.GeometryTypeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = GeometryTypeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidGeometryType {
    String message() default "Invalid geometry type";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}