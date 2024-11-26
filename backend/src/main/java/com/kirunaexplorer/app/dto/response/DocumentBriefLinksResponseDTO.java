package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.LinksDTO;

import java.util.List;

public record DocumentBriefLinksResponseDTO(
    DocumentBriefResponseDTO document,
    List<LinksDTO> links
) {
}
