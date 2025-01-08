package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.inout.LinksDTO;
import com.kirunaexplorer.app.dto.inout.LinksDocumentDTO;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefLinksResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentDiagramResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@EqualsAndHashCode(exclude = {"documentLinks"})
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
    @ManyToMany
    @JoinTable(
        name = "document_stakeholders",
        joinColumns = @JoinColumn(name = "document_id"),
        inverseJoinColumns = @JoinColumn(name = "stakeholder_id")
    )
    private List<Stakeholder> stakeholders;
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
    private Set<DocumentLink> documentLinks;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private GeoReference geoReference; // One-to-one relationship

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DocumentFile> documentFiles;


    /**
     * Converts the Document object to a DocumentResponseDTO object.
     *
     * @return DocumentResponseDTO object
     */
    public DocumentResponseDTO toDocumentResponseDTO(Integer nrConnections) {
        return new DocumentResponseDTO(
            this.id.intValue(),
            this.title,
            this.stakeholders.stream().map(Stakeholder::getName).toList(),
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
            this.stakeholders.stream().map(Stakeholder::getName).toList(),
            this.scale,
            parseDate(this.issuanceDate, this.datePrecision),
            this.type,
            this.geoReference.toGeolocationDTO()
        );
    }

    /***
     * Converts the Document object to a DocumentBriefLinksResponseDTO object.
     * @param linksDTOs List of LinksDTO objects
     * @return DocumentBriefLinksResponseDTO object
     */
    public DocumentBriefLinksResponseDTO toDocumentBriefLinksResponseDTO(List<LinksDTO> linksDTOs) {
        return new DocumentBriefLinksResponseDTO(
            this.toDocumentBriefResponseDTO(),
            linksDTOs
        );
    }

    /**
     * Converts the Document object to a DocumentDiagramResponseDTO object.
     *
     * @param linksDTOs List of LinksDocumentDTO objects
     * @return DocumentDiagramResponseDTO object
     */
    public DocumentDiagramResponseDTO toDocumentDiagramResponseDTO(List<LinksDocumentDTO> linksDTOs) {
        return new DocumentDiagramResponseDTO(
            this.id,
            this.title,
            this.stakeholders.stream().map(Stakeholder::getName).toList(),
            this.scale,
            parseDate(this.issuanceDate, this.datePrecision),
            this.type,
            linksDTOs
        );
    }

    /***
     * Map the document links to DocumentBriefLinksResponseDTO
     * @param documentLinks List of DocumentLink objects
     * @return List<DocumentBriefLinksResponseDTO>
     */
    public List<DocumentBriefLinksResponseDTO> mapLinkedDocumentsToDocumentBriefLinksResponseDTO(List<DocumentLink> documentLinks) {
        return documentLinks.stream()
            .collect(Collectors.groupingBy(link ->
                link.getDocument().equals(this) ? link.getLinkedDocument() : link.getDocument()))
            .entrySet()
            .stream()
            .map(entry -> {
                Document linkedDocument = entry.getKey();
                List<LinksDTO> linksDTOs = entry.getValue().stream()
                    .map(DocumentLink::toLinksDTO)
                    .toList();
                return linkedDocument.toDocumentBriefLinksResponseDTO(linksDTOs);
            })
            .toList();
    }

    public List<DocumentDiagramResponseDTO> mapLinkedDocumentsToDocumentDiagramResponseDTO(List<DocumentLink> documentLinks) {
        return documentLinks.stream()
            .collect(Collectors.groupingBy(link ->
                link.getDocument().equals(this) ? link.getLinkedDocument() : link.getDocument()))
            .entrySet()
            .stream()
            .map(entry -> {
                Document linkedDocument = entry.getKey();
                List<LinksDocumentDTO> linksDTOs = entry.getValue().stream()
                    .map(link -> link.toLinksDocumentDTO(this.id))
                    .toList();
                return linkedDocument.toDocumentDiagramResponseDTO(linksDTOs);
            })
            .toList();
    }

    /***
     * Update the document from a DocumentRequestDTO
     * @param dto DocumentRequestDTO
     */
    public void updateFromDocumentRequestDTO(DocumentRequestDTO dto, List<Stakeholder> stakeholders) {
        this.title = dto.title();
        this.description = dto.description();
        this.stakeholders = stakeholders;
        //this.stakeholders = dto.stakeholders().stream().map(this::convertToStakeholder).toList();
        this.type = dto.type();
        this.scale = dto.scale();
        this.issuanceDate = dto.parseIssuanceDate(dto.issuanceDate());
        this.datePrecision = dto.determineDatePrecision(dto.issuanceDate());
        this.language = dto.language();
        this.pages = dto.nrPages();
        this.updatedAt = LocalDateTime.now();
    }

    private Stakeholder convertToStakeholder(String name) {
        return new Stakeholder(name);
    }

    public void addFile(DocumentFile file) {
        this.documentFiles.add(file);
    }

    public void removeFile(DocumentFile file) {
        this.documentFiles.remove(file);
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

    // I had to override equals and hashcode because the ones created by jakarta with @EqualsAndHashCode(exclude = {"documentLinks"}) were recursive, and I was getting a stack overflow error, dunno why
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Document document)) return false;
        return id.equals(document.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
