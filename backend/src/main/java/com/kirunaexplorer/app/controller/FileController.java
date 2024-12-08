package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.dto.response.FileSnippetResponseDTO;
import com.kirunaexplorer.app.service.FileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    /**
     * Upload a file for a document
     *
     * @param id                Document id
     * @param fileUploadRequest FileUploadRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping("/documents/{id}/files")
    public ResponseEntity<Void> uploadFile(
        @PathVariable Long id,
        @ModelAttribute @Valid FileUploadRequestDTO fileUploadRequest
    ) {
        Long fileId = fileService.storeFiles(id, fileUploadRequest);
        URI location = URI.create("/api/v1/files/" + fileId);
        return ResponseEntity.created(location).build();
    }

    /**
     * Download a file
     *
     * @param fileId File id
     * @return ResponseEntity<byte [ ]>
     */
    @GetMapping("/files/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        return ResponseEntity.ok().body(fileService.getFile(fileId));
    }

    /**
     * Delete a file
     *
     * @param fileId File id
     * @return ResponseEntity<Void>
     */
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        fileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get files snippet for a document
     *
     * @param id Document id
     * @return List of FileSnippetResponseDTO
     */
    @GetMapping("/documents/{id}/files")
    public ResponseEntity<List<FileSnippetResponseDTO>> getFilesSnippet(@PathVariable Long id) {
        return ResponseEntity.ok().body(fileService.getFilesSnippet(id));
    }
}
