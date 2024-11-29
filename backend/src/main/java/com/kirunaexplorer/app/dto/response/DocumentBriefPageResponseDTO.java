package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.model.Document;
import org.springframework.data.domain.Page;

import java.util.List;

public record DocumentBriefPageResponseDTO(
    int totalPages,
    int currentPage,
    int totalItems,
    List<DocumentBriefResponseDTO> documentSnippets
) {
    public static DocumentBriefPageResponseDTO from(Page<Document> pagedResult) {
        return new DocumentBriefPageResponseDTO(
            pagedResult.getTotalPages(),
            pagedResult.getNumber(),
            pagedResult.getNumberOfElements(),
            pagedResult.stream()
                .map(Document::toDocumentBriefResponseDTO)
                .toList()
        );
    }
}
