package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.LinksDocumentDTO;

import java.util.List;

public record DocumentDiagramResponseDTO(
    Long id,
    String title,
    List<String> stakeholders,
    String scale,
    String issuanceDate,
    String type,
    List<LinksDocumentDTO> links
) {
}
