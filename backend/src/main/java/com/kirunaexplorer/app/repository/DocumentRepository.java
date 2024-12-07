package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT d FROM Document d WHERE (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:type IS NULL OR d.type = :type)")
    List<Document> searchDocuments(@Param("keyword") String keyword, @Param("type") String type);

}
