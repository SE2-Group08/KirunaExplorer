package com.kirunaexplorer.app.dto.response;

public record FileSnippetResponseDTO(
    Long id,
    String name,
    String extension,
    Long size
) {
}
