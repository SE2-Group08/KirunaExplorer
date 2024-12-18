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

    @Query("SELECT d FROM Document d WHERE " +
            "(:keyword IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:type IS NULL OR d.type = :type) AND " +
            "(:stakeholderNames IS NULL OR EXISTS (SELECT s FROM d.stakeholders s WHERE s.name IN :stakeholderNames)) AND " +
            "(:scale IS NULL OR d.scale = :scale)")
    Page<Document> searchDocuments(@Param("keyword") String keyword,
                                   @Param("type") String type,
                                   @Param("stakeholderNames") List<String> stakeholderNames,
                                   @Param("scale") String scale,
                                   Pageable pageable);

}
