package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.DocumentScale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentScaleRepository extends JpaRepository<DocumentScale, Long> {
}
