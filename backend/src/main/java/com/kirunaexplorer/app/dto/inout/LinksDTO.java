package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.constants.DocumentLinkType;

/**
 * Java record to store the id of the link and the type of the link
 */
public record LinksDTO(
    Long linkId,
    DocumentLinkType linkType
) {
}
