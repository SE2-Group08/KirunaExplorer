package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public record FileUploadRequestDTO(
    Long id,
    String name,
    String extension,
    Long size,
    MultipartFile file
) {
    public Optional<DocumentFile> toDocumentFile(Document document) {
        try {
            return Optional.of(new DocumentFile(null, document, name(), extension(), size(), file().getBytes()));
        } catch (IOException e) {
            return Optional.empty();
        }
    }
}