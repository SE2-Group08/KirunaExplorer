package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentLinkRepository extends JpaRepository<DocumentLink, Long> {
    @Query("SELECT COUNT(dl) FROM DocumentLink dl WHERE dl.document.id = :documentId OR dl.linkedDocument.id = :documentId")
    Integer countByDocumentId(@Param("documentId") Long documentId);

    List<DocumentLink> findByDocumentOrLinkedDocument(Document document, Document linkedDocument);
}