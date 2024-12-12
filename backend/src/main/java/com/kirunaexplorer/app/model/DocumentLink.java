package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.dto.inout.LinksDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"document", "linkedDocument"})
@ToString(exclude = {"document", "linkedDocument"})
public class DocumentLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for each link

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document; // The originating document

    @ManyToOne
    @JoinColumn(name = "linked_document_id", nullable = false)
    private Document linkedDocument; // The linked document

    @Enumerated(EnumType.STRING)
    private DocumentLinkType type;

    private LocalDateTime createdAt;


    @PrePersist
    @PreUpdate
    private void enforceUndirectedOrder() {
        if (document.getId() > linkedDocument.getId()) {
            Document temp = document;
            document = linkedDocument;
            linkedDocument = temp;
        }
    }

    /**
     * Convert to LinksDTO
     *
     * @return LinksDTO
     */
    public LinksDTO toLinksDTO() {
        return new LinksDTO(this.id, type);
    }
}
