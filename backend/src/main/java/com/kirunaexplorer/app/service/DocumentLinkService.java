package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefLinksResponseDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentLinkService {

    private final DocumentRepository documentRepository;
    private final DocumentLinkRepository documentLinkRepository;
    private static final String ERROR_MESSAGE_NOT_FOUND = "Document not found with ID ";

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
            .orElseThrow(() -> new ResourceNotFoundException(ERROR_MESSAGE_NOT_FOUND + id));
        Document linkedDocument = documentRepository.findById(request.documentId())
            .orElseThrow(() -> new ResourceNotFoundException(ERROR_MESSAGE_NOT_FOUND + request.documentId()));

        // Check if the documents are the same
        if (document.equals(linkedDocument)) {
            throw new IllegalArgumentException("Cannot link a document to itself");
        }

        // Check if the link already exists
        boolean linkExists = documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(document, linkedDocument, request.type()) ||
            documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(linkedDocument, document, request.type());
        if (linkExists) {
            throw new IllegalArgumentException("Link between the documents already exists with the same type");
        }

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
     * @param request LinkDocumentsRequestDTO
     */
    @Transactional
    public void updateLink(LinkDocumentsRequestDTO request) {
        DocumentLink documentLink = documentLinkRepository.findById(request.linkId())
            .orElseThrow(() -> new ResourceNotFoundException(ERROR_MESSAGE_NOT_FOUND + request.linkId()));

        documentLink.setType(request.type());

        documentLinkRepository.save(documentLink);
    }

    /**
     * Delete a document link
     *
     * @param linkId Document link id
     */
    @Transactional
    public void deleteLink(Long linkId) {
        DocumentLink documentLink = documentLinkRepository.findById(linkId)
            .orElseThrow(() -> new ResourceNotFoundException(ERROR_MESSAGE_NOT_FOUND + linkId));

        documentLinkRepository.delete(documentLink);
    }

    /**
     * Get all links for a document
     *
     * @param id Document id
     * @return List<DocumentBriefLinksResponseDTO>
     */
    @Transactional
    public List<DocumentBriefLinksResponseDTO> getDocumentLinks(Long id) {
        // Fetch the document by id
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(ERROR_MESSAGE_NOT_FOUND + id));

        // Fetch all links for the document
        List<DocumentLink> documentLinks = documentLinkRepository.findByDocumentOrLinkedDocument(document, document);

        // Map the document links to DocumentBriefLinksResponseDTO
        return document.mapLinkedDocumentsToDocumentBriefLinksResponseDTO(documentLinks);
    }
}