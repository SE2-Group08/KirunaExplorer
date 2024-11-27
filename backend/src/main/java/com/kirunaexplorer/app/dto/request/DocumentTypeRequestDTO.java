package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.validation.groups.documentType.PostDocumentType;
import jakarta.validation.constraints.*;

public record DocumentTypeRequestDTO(

    @Null(groups = {PostDocumentType.class})
    Long id,

    @NotNull
    @Size(min = 2, max = 64)
    String title
) {

    /***
     * Converts the DocumentRequestDTO to a Document object.
     * @return Document object
     */
    public DocumentType toDocumentType() {
        return new DocumentType(
                id,
                title
            );
    }


}
