package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.DocumentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentTypeRepository extends JpaRepository<DocumentType, Long> {
    Boolean existsByTypeName(@NotNull @Size(min = 2, max = 64) String attr0);
}
