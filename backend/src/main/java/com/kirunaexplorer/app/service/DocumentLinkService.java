package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DocumentLinkService {

    private final DocumentRepository documentRepository;
    private final DocumentLinkRepository documentLinkRepository;

    public DocumentLinkService(DocumentRepository documentRepository, DocumentLinkRepository documentLinkRepository) {
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
    }

    /**
     * Link two documents
     *
     * @param id      Document id
     * @param request LinkDocumentsRequestDTO
     * @return LinkDocumentsResponse
     */
    @Transactional
    public LinkDocumentsResponseDTO linkDocuments(Long id, LinkDocumentsRequestDTO request) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id));
        Document linkedDocument = documentRepository.findById(request.documentId())
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + request.documentId()));

        // Create a new document link
        DocumentLink documentLink = new DocumentLink();

        // Set the other properties
        documentLink.setDocument(document);
        documentLink.setLinkedDocument(linkedDocument);
        documentLink.setType(request.type());
        documentLink.setCreatedAt(LocalDateTime.now());

        documentLink = documentLinkRepository.save(documentLink);
        return new LinkDocumentsResponseDTO(documentLink.getId());
    }

    /**
     * Update a document link
     *
     * @param id      Document link id
     * @param request LinkDocumentsRequestDTO
     */
    @Transactional
    public void updateLink(Long id, LinkDocumentsRequestDTO request) {
        DocumentLink documentLink = documentLinkRepository.findById(request.linkId())
            .orElseThrow(() -> new ResourceNotFoundException("Document link not found with ID " + request.linkId()));

        documentLink.setType(request.type());

        documentLinkRepository.save(documentLink);
    }
}