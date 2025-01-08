package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.exception.FileReadException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public record FileUploadRequestDTO(
    @NotNull
    List<MultipartFile> files
) {
    public List<DocumentFile> toDocumentFiles(Document document) {
        return files.stream()
            .map(file -> {
                String originalFilename = file.getOriginalFilename();
                String name = originalFilename != null ? originalFilename.substring(0, originalFilename.lastIndexOf('.')) : "";
                String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf('.') + 1) : "";
                Long size = file.getSize();
                byte[] content;
                try {
                    content = file.getBytes();
                } catch (IOException e) {
                    throw new FileReadException("Error reading file content", e);
                }

                return new DocumentFile(null, document, name, extension, size, content);
            })
            .toList();
    }
}