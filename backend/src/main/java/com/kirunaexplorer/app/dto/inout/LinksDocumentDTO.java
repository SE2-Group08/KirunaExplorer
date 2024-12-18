package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.constants.DocumentLinkType;

/**
 * Java record to store the id of the linked document and the type of the link
 */
public record LinksDocumentDTO(
    Long documentId,
    DocumentLinkType linkType
) {
}
