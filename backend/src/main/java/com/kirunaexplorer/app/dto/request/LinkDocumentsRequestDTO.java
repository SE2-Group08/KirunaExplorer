package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.validation.groups.link.PostLink;
import com.kirunaexplorer.app.validation.groups.link.PutLink;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

public record LinkDocumentsRequestDTO(
    @NotNull(message = "{link.type.invalid}")
    DocumentLinkType type,

    @Null(groups = {PostLink.class})
    @NotNull(groups = {PutLink.class})
    Long linkId,

    @Null(groups = {PutLink.class})
    @NotNull(groups = {PostLink.class})
    Long documentId
) {
}
