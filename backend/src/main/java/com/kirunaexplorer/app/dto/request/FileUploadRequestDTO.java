package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public record FileUploadRequestDTO(
    @NotNull
    MultipartFile file
) {
    public Optional<DocumentFile> toDocumentFile(Document document) {
        try {
            MultipartFile multipartFile = file();
            String originalFilename = multipartFile.getOriginalFilename();
            String name = originalFilename != null ? originalFilename.substring(0, originalFilename.lastIndexOf('.')) : "";
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf('.') + 1) : "";
            Long size = multipartFile.getSize();
            byte[] content = multipartFile.getBytes();

            return Optional.of(new DocumentFile(null, document, name, extension, size, content));
        } catch (IOException e) {
            return Optional.empty();
        }
    }
}