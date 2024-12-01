package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.repository.DocumentScaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentScaleService {
    private final DocumentScaleRepository documentScaleRepository;

    public DocumentScaleService(DocumentScaleRepository documentScaleRepository) {
        this.documentScaleRepository = documentScaleRepository;
    }

    /***
     * Get all documents in brief format
     * @return List of DocumentBriefResponseDTO
     */
    public List<DocumentScaleResponseDTO> getAllDocumentScales() {
        return documentScaleRepository.findAll().stream()
            .map(DocumentScale::toResponseDTO)
            .toList();
    }


    /***
     * Create a documentScale
     * @param documentScaleRequest DocumentScaleRequestDTO
     * @return DocumentScale.id
     */
    @Transactional
    public Long createDocumentScale(DocumentScaleRequestDTO documentScaleRequest) {
        DocumentScale scale = documentScaleRequest.toDocumentScale();
        scale = documentScaleRepository.save(scale);
        return scale.getId();
    }


}

