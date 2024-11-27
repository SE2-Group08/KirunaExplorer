package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.service.DocumentTypeService;
import com.kirunaexplorer.app.validation.groups.documentType.PostDocumentType;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentTypeController {
    private final DocumentTypeService documentTypeService;

    public DocumentTypeController(DocumentTypeService documentTypeService) {
        this.documentTypeService = documentTypeService;
    }

    /***
     * Endpoint to get all documents in brief format
     * @return List of DocumentBriefResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<DocumentTypeResponseDTO>> getAllDocumentTypes() {
        return ResponseEntity.ok(documentTypeService.getAllDocumentTypes());
    }

    /***
     * Endpoint to create a document
     * @param type DocumentRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping
    public ResponseEntity<Void> createDocument(@RequestBody @Validated({Default.class, PostDocumentType.class}) DocumentTypeRequestDTO type) {
        Long documentId = documentTypeService.createDocumentType(type);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(documentId)
            .toUri();
        return ResponseEntity.created(location).build();
    }



}


