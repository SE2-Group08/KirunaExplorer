package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.validation.groups.document_type.PostDocumentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

public record DocumentTypeRequestDTO(

    @Null(groups = {PostDocumentType.class})
    Long id,

    @NotNull
    @Size(min = 2, max = 64)
    String name
) {

    /***
     * Converts the DocumentRequestDTO to a Document object.
     * @return Document object
     */
    public DocumentType toDocumentType() {
        return new DocumentType(
            id,
            name
        );
    }


}
