package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.validation.groups.document.PostDocument;
import com.kirunaexplorer.app.validation.groups.document.PutDocument;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;

public record DocumentRequestDTO(
    @NotNull(groups = {PutDocument.class})
    @Null(groups = {PostDocument.class})
    Long id,

    @NotNull
    @Size(min = 2, max = 64)
    String title,

    @NotNull
    @Size(min = 1)
    List<@Size(min = 2, max = 64) String> stakeholders,

    @NotNull
    @Size(min = 2, max = 64)
    @Pattern(regexp = "^(1:[1-9]\\d*$|[a-zA-Z\\s/]+)$")
    String scale,

    @NotNull
    @Pattern(regexp = "^\\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\\d|3[01]))?)?$")
    String issuanceDate,

    @NotNull
    @Size(min = 2, max = 64)
    String type,

    @Min(0)
    Integer nrConnections,

    @Size(max = 64)
    String language,

    @Min(0)
    Integer nrPages,

    @Valid
    GeoReferenceDTO geolocation,

    @Size(max = 1000)
    String description
) {

    @Override
    public GeoReferenceDTO geolocation() {
        return Objects.requireNonNullElseGet(this.geolocation, () -> new GeoReferenceDTO(null, null, null));    // some idiomatic shit right here, I like it
    }

    /**
     * Converts the DocumentRequestDTO to a Document object.
     *
     * @return Document object
     */
    public Document toDocument() {
        return new Document(
            id,
            title,
            description,
            stakeholders.stream().map(Stakeholder::new).toList(),
            type,
            scale,
            parseIssuanceDate(issuanceDate),
            determineDatePrecision(issuanceDate),
            language,
            nrPages,
            LocalDateTime.now(),
            null,
            new HashSet<>(),
            null,
            new HashSet<>()
        );
    }

    /**
     * Returns the DatePrecision of the date.
     *
     * @param date date
     * @return DatePrecision
     */
    public Document.DatePrecision determineDatePrecision(String date) {
        return switch (date.length()) {
            case 4 -> Document.DatePrecision.YEAR_ONLY;
            case 7 -> Document.DatePrecision.MONTH_YEAR;
            default -> Document.DatePrecision.FULL_DATE;
        };
    }

    public LocalDate parseIssuanceDate(String date) {
        return LocalDate.parse(
            switch (date.length()) {
                case 4 -> date + "-01-01";
                case 7 -> date + "-01";
                default -> date;
            }
        );
    }

}
