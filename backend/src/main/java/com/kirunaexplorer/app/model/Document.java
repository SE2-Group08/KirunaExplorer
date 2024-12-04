package com.kirunaexplorer.app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"documentLinks"})
@ToString(exclude = {"documentLinks"})
@Table(name = "DOCUMENT")
public class Document {

    public enum DatePrecision {
        YEAR_ONLY,
        MONTH_YEAR,
        FULL_DATE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;
    private String stakeholders;
    private String type;
    private String scale;
    private LocalDate issuanceDate;
    @Enumerated(EnumType.STRING)
    private DatePrecision datePrecision;
    private String language;
    private Integer pages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "document", fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<DocumentLink> documentLinks;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private GeoReference geoReference; // One-to-one relationship

    @OneToMany(mappedBy = "id")
    private Set<DocumentFile> documentFiles;


    /**
     * Converts the Document object to a DocumentResponseDTO object.
     *
     * @return DocumentResponseDTO object
     */
    public DocumentResponseDTO toResponseDTO(Integer nrConnections) {
        return new DocumentResponseDTO(
            this.id.intValue(),
            this.title,
            List.of(this.stakeholders.split("/")),
            this.scale,
            parseDate(this.issuanceDate, this.datePrecision),
            this.type,
            nrConnections,//this.documentLinks.size(),
            this.language,
            this.pages,
            this.geoReference.toGeolocationDTO(),
            this.description
        );
    }

    /**
     * Converts the Document object to a DocumentBriefResponseDTO object.
     *
     * @return DocumentBriefResponseDTO object
     */
    public DocumentBriefResponseDTO toDocumentBriefResponseDTO() {
        return new DocumentBriefResponseDTO(
            this.id,
            this.title,
            List.of(this.stakeholders.split("/")),
            this.scale,
            parseDate(this.issuanceDate, this.datePrecision),
            this.type,
            this.geoReference.toGeolocationDTO()
        );
    }

    public void updateFromDTO(DocumentRequestDTO dto) {
        this.title = dto.title();
        this.description = dto.description();
        this.stakeholders = String.join("/", dto.stakeholders());
        this.type = dto.type();
        this.scale = dto.scale();
        this.issuanceDate = dto.parseIssuanceDate(dto.issuanceDate());
        this.datePrecision = dto.determineDatePrecision(dto.issuanceDate());
        this.language = dto.language();
        this.pages = dto.nrPages();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Parse the date to a string given the precision
     *
     * @param issuanceDate  date
     * @param datePrecision precision
     * @return String
     */
    private String parseDate(LocalDate issuanceDate, DatePrecision datePrecision) {
        return switch (datePrecision) {
            case YEAR_ONLY -> String.format("%04d", issuanceDate.getYear());
            case MONTH_YEAR -> String.format("%04d-%02d", issuanceDate.getYear(), issuanceDate.getMonthValue());
            case FULL_DATE -> issuanceDate.toString();
        };
    }
}
