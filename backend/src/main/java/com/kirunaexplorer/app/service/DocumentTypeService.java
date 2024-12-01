package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.repository.DocumentTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentTypeService {
    private final DocumentTypeRepository documentTypeRepository;

    public DocumentTypeService(DocumentTypeRepository documentTypeRepository) {
        this.documentTypeRepository = documentTypeRepository;
    }

    /**
     * Get all document types
     *
     * @return List of DocumentTypeResponseDTO
     */
    @Transactional
    public List<DocumentTypeResponseDTO> getAllDocumentTypes() {
        return documentTypeRepository.findAll().stream()
            .map(DocumentType::toResponseDTO)
            .toList();
    }

    /**
     * Create a document type
     *
     * @param documentTypeRequest DocumentTypeRequestDTO
     * @return created document type id
     */
    @Transactional
    public Long createDocumentType(DocumentTypeRequestDTO documentTypeRequest) {
        Boolean documentTypeExists = documentTypeRepository.existsByTypeName((documentTypeRequest.name()));
        if (documentTypeExists) {
            throw new IllegalArgumentException("Document type already exists");
        }

        DocumentType type = documentTypeRequest.toDocumentType();
        type = documentTypeRepository.save(type);

        return type.getId();
    }

}

