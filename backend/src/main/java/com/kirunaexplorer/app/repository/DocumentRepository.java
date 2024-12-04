package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    /**
     * Find all documents in pageable format
     *
     * @param pageable Pageable
     * @return Page of Document
     */
    Page<Document> findAll(Pageable pageable);
}
