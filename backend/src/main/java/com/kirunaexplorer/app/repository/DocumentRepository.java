package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Area;
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
    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.geoReference gr LEFT JOIN FETCH gr.area a LEFT JOIN FETCH gr.pointCoordinates pc")
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


    @Query("SELECT d FROM Document d WHERE d.geoReference.area = :area")
    List<Document> findByGeoReferenceArea(@Param("area") Area area);

    @Query("SELECT d FROM Document d WHERE d.geoReference.area IS NOT NULL")
    List<Document> findByGeoReferenceAreaIsNotNull();

    @Query("SELECT d FROM Document d WHERE d.geoReference.pointCoordinates IS NOT NULL")
    List<Document> findByGeoReferencePointCoordinatesIsNotNull();

    @Query("SELECT d FROM Document d WHERE d.geoReference.area IS NULL AND d.geoReference.pointCoordinates IS NULL")
    List<Document> findByGeoReferenceIsNull();
}
