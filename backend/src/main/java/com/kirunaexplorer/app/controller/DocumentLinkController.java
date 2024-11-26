package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefLinksResponseDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.service.DocumentLinkService;
import com.kirunaexplorer.app.validation.groups.link.PostLink;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentLinkController {

    private final DocumentLinkService documentLinkService;

    public DocumentLinkController(DocumentLinkService documentLinkService) {
        this.documentLinkService = documentLinkService;
    }

    /***
     * Endpoint to link two documents
     * @param id Document id
     * @param request LinkDocumentsRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping("/{id}/links")
    public ResponseEntity<Void> linkDocuments(@PathVariable Long id, @RequestBody @Validated({Default.class, PostLink.class}) LinkDocumentsRequestDTO request) {
        LinkDocumentsResponseDTO response = documentLinkService.linkDocuments(id, request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(response.linkId())
            .toUri();
        return ResponseEntity.created(location).build();
    }

    /***
     * Endpoint to update a document link
     * @param request LinkDocumentsRequestDTO
     * @return ResponseEntity<Void>
     */
    @PutMapping("/links")
    public ResponseEntity<Void> updateLink(@RequestBody LinkDocumentsRequestDTO request) {
        documentLinkService.updateLink(request);
        return ResponseEntity.noContent().build();
    }

    /***
     * Endpoint to delete a document link
     * @param id Document id
     * @param linkId Document link id
     * @return ResponseEntity<Void>
     */
    @DeleteMapping("/{id}/links/{linkId}")
    public ResponseEntity<Void> deleteLink(@PathVariable Long id, @PathVariable Long linkId) {
        documentLinkService.deleteLink(id, linkId);
        return ResponseEntity.noContent().build();
    }

    /***
     * Endpoint to get all links for a document
     * @param id Document id
     * @return ResponseEntity<List < DocumentBriefLinksResponseDTO>>
     */
    @GetMapping("/{id}/links")
    public ResponseEntity<List<DocumentBriefLinksResponseDTO>> getDocumentLinks(@PathVariable Long id) {
        return ResponseEntity.ok(documentLinkService.getDocumentLinks(id));
    }
}
