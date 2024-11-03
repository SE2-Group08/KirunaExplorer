package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.kirunaexplorer.app.constants.AppConstants.DOCUMENTS_URI;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    /***
     * Get all documents
     * @return List of DocumentBriefResponseDTO
     */
    public List<DocumentBriefResponseDTO> getAllDocuments() {
        List<Document> documents = documentRepository.findAll();

        return documents.stream()
            .map(
                document -> new DocumentBriefResponseDTO(DOCUMENTS_URI + document.getId(), document.getTitle())
            ).toList();
    }
}
