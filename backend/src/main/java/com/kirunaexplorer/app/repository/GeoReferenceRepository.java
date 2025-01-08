package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.GeoReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeoReferenceRepository extends JpaRepository<GeoReference, Long> {

}
