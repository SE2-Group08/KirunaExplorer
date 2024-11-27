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

    /***
     * Get all documents in brief format
     * @return List of DocumentBriefResponseDTO
     */
    public List<DocumentTypeResponseDTO> getAllDocumentTypes() {
        return documentTypeRepository.findAll().stream()
            .map(DocumentType::toResponseDTO)
            .toList();
    }


    /***
     * Create a document
     * @param documentTypeRequest DocumentTypeRequestDTO
     * @return DocumentRequestDTO
     */
    @Transactional
    public Long createDocumentType(DocumentTypeRequestDTO documentTypeRequest) {
        DocumentType type = documentTypeRequest.toDocumentType();
        type = documentTypeRepository.save(type);


        return type.getId();
    }

}

