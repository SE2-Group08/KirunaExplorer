package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.GeoReferenceRepository;
import com.kirunaexplorer.app.repository.StakeholderRepository;
import com.kirunaexplorer.app.util.DocumentFieldsChecker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final DocumentLinkRepository documentLinkRepository;
    private final StakeholderRepository stakeholderRepository;

    public DocumentService(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        DocumentLinkRepository documentLinkRepository,
        StakeholderRepository stakeholderRepository
    ) {
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
        this.stakeholderRepository = stakeholderRepository;
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
        // Remove duplicates
        DocumentFieldsChecker.removeStakeholderDuplicates(documentRequest);

        // Get existing stakeholders
        List<Stakeholder> existingStakeholders = stakeholderRepository.findAll();

        // Get new stakeholders to add to the database
        List<Stakeholder> newStakeholders = DocumentFieldsChecker.getNewStakeholders(documentRequest.stakeholders(), existingStakeholders);

        // Add new stakeholders to the database
        stakeholderRepository.saveAll(newStakeholders);

        // Save document
        Document document = documentRequest.toDocument();
        document = documentRepository.save(document);

        // Save geolocation
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
        // Get document by id
        Long id = documentRequest.id();
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id));

        // Remove duplicates
        DocumentFieldsChecker.removeStakeholderDuplicates(documentRequest);

        // Get existing stakeholders
        List<Stakeholder> existingStakeholders = stakeholderRepository.findAll();

        // Get new stakeholders to add to the database
        List<Stakeholder> newStakeholders = DocumentFieldsChecker.getNewStakeholders(documentRequest.stakeholders(), existingStakeholders);

        // Add new stakeholders to the database
        stakeholderRepository.saveAll(newStakeholders);

        // Update document
        document.updateFromDTO(documentRequest);
        documentRepository.save(document);

        GeoReference geoReference = geoReferenceRepository.findById(document.getId())
            .orElseGet(() -> new GeoReference(document.getId(), document)); // Create new if not exist

        geoReference.updateFromDTO(documentRequest.geolocation()); // Update geolocation
        geoReferenceRepository.save(geoReference);
    }


}

