package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.service.DocumentScaleService;
import com.kirunaexplorer.app.validation.groups.document.PostDocument;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/scales")
public class DocumentScaleController {
    private final DocumentScaleService documentScaleService;

    public DocumentScaleController(DocumentScaleService documentScaleService) {
        this.documentScaleService = documentScaleService;
    }

    /***
     * Endpoint to get all documents in brief format
     * @return List of DocumentBriefResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<DocumentScaleResponseDTO>> getAllDocuments() {
        return ResponseEntity.ok(documentScaleService.getAllDocumentScales());
    }



    /***
     * Endpoint to create a document
     * @param scale DocumentScaleRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping
    public ResponseEntity<Void> createDocument(@RequestBody @Validated({Default.class, PostDocument.class}) DocumentScaleRequestDTO scale) {
        Long documentId = documentScaleService.createDocumentScale(scale);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(documentId)
            .toUri();
        return ResponseEntity.created(location).build();
    }


}


