package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.GeoReferenceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final DocumentLinkRepository documentLinkRepository;

    private static final int PAGE_SIZE = 16;

    public DocumentService(DocumentRepository documentRepository, GeoReferenceRepository geoReferenceRepository, DocumentLinkRepository documentLinkRepository) {
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
    }

    /**
     * Get all documents in brief format of a given page
     *
     * @param pageNo Page number
     * @return List of DocumentBriefPageResponseDTO
     */
    public List<DocumentBriefPageResponseDTO> getDocumentsByPageNumber(int pageNo) {
        Page<Document> pagedResult = documentRepository.findAll(PageRequest.of(pageNo, PAGE_SIZE));

        return List.of(DocumentBriefPageResponseDTO.from(pagedResult));
    }

    /**
     * Get a document by id
     *
     * @param id Document id
     * @return DocumentResponseDTO
     */
    public DocumentResponseDTO getDocumentById(Long id) {

        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id))
            .toResponseDTO(documentLinkRepository.countByDocumentId(id));
    }

    /**
     * Create a document
     *
     * @param documentRequest DocumentRequestDTO
     * @return DocumentRequestDTO
     */
    @Transactional
    public Long createDocument(DocumentRequestDTO documentRequest) {
        Document document = documentRequest.toDocument();
        document = documentRepository.save(document);

        GeoReference geoReference = documentRequest.geolocation().toGeoReference(document);
        geoReferenceRepository.save(geoReference);

        return document.getId();
    }

    /**
     * Update a document
     *
     * @param documentRequest DocumentRequestDTO
     */
    @Transactional
    public void updateDocument(DocumentRequestDTO documentRequest) {
        Long id = documentRequest.id();
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id));

        document.updateFromDTO(documentRequest); // Update fields
        documentRepository.save(document);

        GeoReference geoReference = geoReferenceRepository.findById(document.getId())
            .orElseGet(() -> new GeoReference(document.getId(), document)); // Create new if not exist

        geoReference.updateFromDTO(documentRequest.geolocation()); // Update geolocation
        geoReferenceRepository.save(geoReference);
    }

    /**
     * Get all documents in brief format
     *
     * @return List of DocumentBriefResponseDTO
     */
    public List<DocumentBriefResponseDTO> getAllDocuments() {
        return documentRepository.findAll().stream()
            .map(Document::toDocumentBriefResponseDTO)
            .toList();
    }
}

