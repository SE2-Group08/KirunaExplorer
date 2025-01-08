package com.kirunaexplorer.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class DocumentLinkId implements Serializable {
    @Column(name = "document_id")
    private Long documentId;
    @Column(name = "linked_document_id")
    private Long linkedDocumentId;
}
