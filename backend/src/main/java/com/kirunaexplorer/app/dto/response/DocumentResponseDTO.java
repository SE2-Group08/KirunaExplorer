package com.kirunaexplorer.app.dto.response;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;

import java.util.List;

public record DocumentResponseDTO(
    Integer id,
    String title,
    List<String> stakeholders,
    String scale,
    String issuanceDate,
    String type,
    Integer nrConnections,
    String language,
    Integer nrPages,
    GeoReferenceDTO geolocation,
    String description
) {
}
