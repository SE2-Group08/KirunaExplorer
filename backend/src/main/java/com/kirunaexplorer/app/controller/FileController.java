package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

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
        @ModelAttribute FileUploadRequestDTO fileUploadRequest
    ) {
        Long fileId = fileService.storeFile(id, fileUploadRequest);
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
}
