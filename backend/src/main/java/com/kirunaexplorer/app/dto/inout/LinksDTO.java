package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.constants.DocumentLinkType;

public record LinksDTO(
    Long linkId,
    DocumentLinkType linkType
) {
}
