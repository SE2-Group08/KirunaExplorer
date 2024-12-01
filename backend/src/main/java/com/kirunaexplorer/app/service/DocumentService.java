package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.*;
import com.kirunaexplorer.app.util.DocumentFieldsChecker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final DocumentLinkRepository documentLinkRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;

    public DocumentService(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        DocumentLinkRepository documentLinkRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository
        DocumentScaleRepository documentScaleRepository
    ) {
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
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

        // Remove duplicates stakeholders
        DocumentFieldsChecker.removeStakeholderDuplicates(documentRequest);
        // Get existing stakeholders
        List<Stakeholder> existingStakeholders = stakeholderRepository.findAll();
        // Get new stakeholders to add to the database
        List<Stakeholder> newStakeholders = DocumentFieldsChecker.getNewStakeholders(documentRequest.stakeholders(), existingStakeholders);
        // Add new stakeholders to the database
        stakeholderRepository.saveAll(newStakeholders);

        // Get existing document types
        List<DocumentType> existingDocumentTypes = documentTypeRepository.findAll();
        // Get new document type to add to the database
        DocumentType newDocumentType = DocumentFieldsChecker.getNewDocumentType(documentRequest.type(), existingDocumentTypes);
        // Add new document type to the database
        if (newDocumentType != null) {
            documentTypeRepository.save(newDocumentType);
        }

        // Save document
        Document document = documentRequest.toDocument();
        document = documentRepository.save(document);

        // Save geolocation
        GeoReference geoReference = documentRequest.geolocation().toGeoReference(document);
        geoReferenceRepository.save(geoReference);

        // Get existing scales
        List<DocumentScale> existingScales = documentScaleRepository.findAll();
        // Get new scale to add to the db
        DocumentScale newScale =  DocumentFieldsChecker.getNewScale(documentRequest.scale(), existingScales);
        // Add new scale to the db
        if(newScale != null) {
            documentScaleRepository.save(newScale);
        }

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

        // Remove duplicates stakeholders
        DocumentFieldsChecker.removeStakeholderDuplicates(documentRequest);
        // Get existing stakeholders
        List<Stakeholder> existingStakeholders = stakeholderRepository.findAll();
        // Get new stakeholders to add to the database
        List<Stakeholder> newStakeholders = DocumentFieldsChecker.getNewStakeholders(documentRequest.stakeholders(), existingStakeholders);
        // Add new stakeholders to the database
        stakeholderRepository.saveAll(newStakeholders);

        // Get existing document types
        List<DocumentType> existingDocumentTypes = documentTypeRepository.findAll();
        // Get new document type to add to the database
        DocumentType newDocumentType = DocumentFieldsChecker.getNewDocumentType(documentRequest.type(), existingDocumentTypes);
        // Add new document type to the database
        if (newDocumentType != null) {
            documentTypeRepository.save(newDocumentType);
        }

        // Update document
        document.updateFromDTO(documentRequest);
        documentRepository.save(document);

        GeoReference geoReference = geoReferenceRepository.findById(document.getId())
            .orElseGet(() -> new GeoReference(document.getId(), document)); // Create new if not exist

        geoReference.updateFromDTO(documentRequest.geolocation()); // Update geolocation
        geoReferenceRepository.save(geoReference);
    }


}

