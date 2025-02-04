package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.constants.FilterOptionForMap;
import com.kirunaexplorer.app.dto.inout.LinksDocumentDTO;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentDiagramResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.repository.*;
import com.kirunaexplorer.app.util.DocumentFieldsChecker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final DocumentLinkRepository documentLinkRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final AreaRepository areaRepository;
    private final PointCoordinatesRepository pointCoordinatesRepository;

    private static final int PAGE_SIZE = 16;

    public DocumentService(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        DocumentLinkRepository documentLinkRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentScaleRepository documentScaleRepository,
        AreaRepository areaRepository,
        PointCoordinatesRepository pointCoordinatesRepository
    ) {
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentRepository = documentRepository;
        this.documentLinkRepository = documentLinkRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
        this.areaRepository = areaRepository;
        this.pointCoordinatesRepository = pointCoordinatesRepository;
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
    @Transactional
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
    @Transactional
    public DocumentResponseDTO getDocumentById(Long id) {

        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id))
            .toDocumentResponseDTO(documentLinkRepository.countByDocumentId(id));
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

        List<Stakeholder> stakeholdersReference = stakeholderRepository.findByNameIn(documentRequest.stakeholders());

        // Save document
        Document document = documentRequest.toDocument(stakeholdersReference);
        document = documentRepository.save(document);

        storeGeolocation(documentRequest, document);

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

        List<Stakeholder> stakeholdersReference = stakeholderRepository.findByNameIn(documentRequest.stakeholders());

        // Update document
        document.updateFromDocumentRequestDTO(documentRequest, stakeholdersReference);
        documentRepository.save(document);

        GeoReference geoReference = geoReferenceRepository.findById(document.getId())
            .orElseGet(() -> new GeoReference(document.getId(), document)); // Create new if not exist

        updateGeolocation(documentRequest, geoReference);
    }

    public List<DocumentBriefResponseDTO> searchMap(String keyword, String type, List<String> stakeholderNames, String scale) {
        List<Document> documents = documentRepository.searchMap(keyword, type, stakeholderNames, scale);
        if (documents == null) {
            return Collections.emptyList();
        }
        return documents.stream().map(Document::toDocumentBriefResponseDTO).toList();
    }

    public List<DocumentBriefPageResponseDTO> searchDocuments(String keyword, String type, List<String> stakeholderNames, String scale, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE);
        Page<Document> documents = documentRepository.searchDocuments(keyword, type, stakeholderNames, scale, pageable);
        if (documents == null) {
            return Collections.emptyList();
        }
        return List.of(DocumentBriefPageResponseDTO.from(documents));
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

    /**
     * Get all documents formatted for diagram representation.
     *
     * @return List of DocumentDiagramResponseDTO
     */
    public List<DocumentDiagramResponseDTO> getDocumentsForDiagram() {
        return documentRepository.findAll().stream()
            .map(document -> {
                List<DocumentLink> documentLinks = documentLinkRepository.findByDocumentOrLinkedDocument(document, document);
                List<LinksDocumentDTO> linksDTOs = documentLinks.stream()
                    .map(documentLink -> documentLink.toLinksDocumentDTO(document.getId()))
                    .toList();
                return document.toDocumentDiagramResponseDTO(linksDTOs);
            })
            .toList();
    }


    private void storeGeolocation(DocumentRequestDTO documentRequest, Document document) {
        if (documentRequest.geolocation().area() != null) {
            Area existingArea = areaRepository.findById(documentRequest.geolocation().area().areaId())              // Area specified in the request
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with ID " + documentRequest.geolocation().area().areaId()));

            GeoReference newGeoReference = new GeoReference(document, existingArea, null);
            geoReferenceRepository.save(newGeoReference);

            return;
        }

        if (documentRequest.geolocation().pointCoordinates() != null) {                                             // PointCoordinates specified in the request
            PointCoordinates existingPointCoordinates = pointCoordinatesRepository.findById(documentRequest.geolocation().pointCoordinates().pointId())
                .orElseThrow(() -> new ResourceNotFoundException("PointCoordinates not found with ID " + documentRequest.geolocation().pointCoordinates().pointId()));

            GeoReference newGeoReference = new GeoReference(document, null, existingPointCoordinates);
            geoReferenceRepository.save(newGeoReference);

            return;
        }

        //GeoReference geoReference = new GeoReference(document.getId(), document);                                 // No geolocation specified in the request
        GeoReference geoReference = new GeoReference(document, null, null);
        geoReferenceRepository.save(geoReference);
    }

    private void updateGeolocation(DocumentRequestDTO documentRequest, GeoReference geoReference) {
        if (documentRequest.geolocation().area() != null) {
            Area existingArea = areaRepository.findById(documentRequest.geolocation().area().areaId())
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with ID " + documentRequest.geolocation().area().areaId()));

            geoReference.setArea(existingArea);
            geoReferenceRepository.save(geoReference);
        } else if (documentRequest.geolocation().pointCoordinates() != null) {
            PointCoordinates existingPointCoordinates = pointCoordinatesRepository.findById(documentRequest.geolocation().pointCoordinates().pointId())
                .orElseThrow(() -> new ResourceNotFoundException("PointCoordinates not found with ID " + documentRequest.geolocation().pointCoordinates().pointId()));

            geoReference.setPointCoordinates(existingPointCoordinates);
            geoReferenceRepository.save(geoReference);
        } else {
            geoReference.setArea(null);
        }
    }

    @Transactional
    public List<DocumentBriefResponseDTO> getDocumentsByAreaName(String areaName) {
        Area area = areaRepository.findAreaByName(areaName)
            .orElseThrow(() -> new ResourceNotFoundException("Area not found with name " + areaName));

        return documentRepository.findByGeoReferenceArea(area).stream()
            .map(Document::toDocumentBriefResponseDTO)
            .toList();
    }

    @Transactional
    public List<DocumentBriefResponseDTO> getDocumentsForMap(String filter) {
        FilterOptionForMap filterEnum = FilterOptionForMap.valueOf(filter.replace("-", "_").toUpperCase());

        List<Document> documents = switch (filterEnum) {
            case AREA_ONLY -> documentRepository.findByGeoReferenceAreaIsNotNull();
            case POINT_ONLY -> documentRepository.findByGeoReferencePointCoordinatesIsNotNull();
            case NO_GEOLOCATION -> documentRepository.findByGeoReferenceIsNull();
            default -> documentRepository.findAll();
        };
        return documents.stream()
            .map(Document::toDocumentBriefResponseDTO)
            .toList();
    }
}