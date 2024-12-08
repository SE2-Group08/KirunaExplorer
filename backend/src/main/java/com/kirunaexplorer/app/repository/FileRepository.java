package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.DocumentFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<DocumentFile, Long> {
}
