package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentDiagramResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.service.DocumentService;
import com.kirunaexplorer.app.validation.groups.document.PostDocument;
import com.kirunaexplorer.app.validation.groups.document.PutDocument;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Endpoint to get all documents in brief format of a given page
     *
     * @param pageNo Page number
     * @return List of DocumentBriefPageResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<DocumentBriefPageResponseDTO>> getDocumentsByPageNumber(@RequestParam(value = "pageNo", required = false, defaultValue = "0") @Min(0) int pageNo) {
        return ResponseEntity.ok(documentService.getDocumentsByPageNumber(pageNo));
    }

    /**
     * Endpoint to get a document by id
     *
     * @param id Document id
     * @return DocumentResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    /**
     * Endpoint to get documents for the map view based on a filter.
     *
     * @param filter Filter criteria for documents (all, area-only, point-only, no-geolocation)
     * @return List of DocumentBriefResponseDTO
     */
    @GetMapping("/map")
    public ResponseEntity<List<DocumentBriefResponseDTO>> getDocumentsForMap(
        @RequestParam(value = "filter", required = false, defaultValue = "all")
        @Pattern(regexp = "^(all|area-only|point-only|no-geolocation)$", message = "Invalid filter value") String filter
    ) {
        return ResponseEntity.ok(documentService.getDocumentsForMap(filter));
    }

    /**
     * Endpoint to create a document
     *
     * @param document DocumentRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping
    public ResponseEntity<Void> createDocument(@RequestBody @Validated({Default.class, PostDocument.class}) DocumentRequestDTO document) {
        Long documentId = documentService.createDocument(document);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(documentId)
            .toUri();
        return ResponseEntity.created(location).build();
    }

    /**
     * Endpoint to update a document
     *
     * @param document DocumentRequestDTO
     * @return ResponseEntity<Void>
     */
    @PutMapping
    public ResponseEntity<Void> updateDocument(@RequestBody @Validated({Default.class, PutDocument.class}) DocumentRequestDTO document) {
        documentService.updateDocument(document);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search-map")
    public List<DocumentBriefResponseDTO> searchMap(@RequestParam(required = false) String keyword,
                                                    @RequestParam(required = false) String type,
                                                    @RequestParam(required = false) List<String> stakeholderNames,
                                                    @RequestParam(required = false) String scale) {
        return documentService.searchMap(keyword, type, stakeholderNames, scale);
    }

    @GetMapping("/search")
    public List<DocumentBriefPageResponseDTO> searchDocuments(@RequestParam(required = false) String keyword,
                                                          @RequestParam(required = false) String type,
                                                          @RequestParam(required = false) List<String> stakeholderNames,
                                                          @RequestParam(required = false) String scale,
                                                          @RequestParam(value = "pageNo", required = false, defaultValue = "0") @Min(0) int pageNo) {
        return documentService.searchDocuments(keyword, type, stakeholderNames, scale, pageNo);
    }

    @GetMapping("/area/{areaName}")
    public ResponseEntity<List<DocumentBriefResponseDTO>> getDocumentsByArea(@PathVariable String areaName) {
        return ResponseEntity.ok(documentService.getDocumentsByAreaName(areaName));
    }

    /**
     * Endpoint to get all documents in brief format for the diagram
     *
     * @return List of DocumentBriefLinksResponseDTO
     */
    @GetMapping("/diagram")
    public ResponseEntity<List<DocumentDiagramResponseDTO>> getDocumentsForDiagram() {
        return ResponseEntity.ok(documentService.getDocumentsForDiagram());
    }
}


