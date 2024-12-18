package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.repository.*;
import com.kirunaexplorer.app.util.DocumentFieldsChecker;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
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
    private final DocumentScaleRepository documentScaleRepository;
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final MessageSource messageSource;

    private static final int PAGE_SIZE = 16;

    public DocumentService(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        DocumentLinkRepository documentLinkRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentScaleRepository documentScaleRepository,
        MessageSource messageSource
    ) {
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
        this.messageSource = messageSource;
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
     * Get all documents in brief format of a given page
     *
     * @param pageNo Page number
     * @return List of DocumentBriefPageResponseDTO
     */
    public List<DocumentBriefPageResponseDTO> getDocumentsByPageNumber(int pageNo) {
        Page<Document> pagedResult = documentRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(pageNo, PAGE_SIZE));
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
            .orElseThrow(() -> new ResourceNotFoundException(
                messageSource.getMessage("error.document.notFound", new Object[]{String.valueOf(id)}, LocaleContextHolder.getLocale())
            ))
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

        // Store new stakeholders, type and scale
        storeNewStakeholdersTypeScale(documentRequest);

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

        // Store new stakeholders, type and scale
        storeNewStakeholdersTypeScale(documentRequest);

        // Update document
        document.updateFromDocumentRequestDTO(documentRequest);
        documentRepository.save(document);

        GeoReference geoReference = geoReferenceRepository.findById(document.getId())
            .orElseGet(() -> new GeoReference(document.getId(), document)); // Create new if not exist

        geoReference.updateFromDTO(documentRequest.geolocation()); // Update geolocation
        geoReferenceRepository.save(geoReference);
    }

    public List<DocumentBriefResponseDTO> searchDocuments(String keyword, String type) {
        List<Document> documents = documentRepository.searchDocuments(keyword, type);
        if (documents == null) {
            return List.of();
        }
        return documents.stream()
            .map(Document::toDocumentBriefResponseDTO)
            .toList();
    }

    /**
     * Store new stakeholders, type and scale
     *
     * @param documentRequest DocumentRequestDTO
     */
    private void storeNewStakeholdersTypeScale(DocumentRequestDTO documentRequest) {
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

        // Get existing scales
        List<DocumentScale> existingScales = documentScaleRepository.findAll();
        // Get new scale to add to the db
        DocumentScale newScale = DocumentFieldsChecker.getNewDocumentScale(documentRequest.scale(), existingScales);
        // Add new scale to the db
        if (newScale != null) {
            documentScaleRepository.save(newScale);
        }
    }
}

