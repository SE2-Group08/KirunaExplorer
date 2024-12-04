package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    /**
     * Find all documents in pageable format ordered by created date
     *
     * @param pageable Pageable
     * @return Page of Document
     */
    Page<Document> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
