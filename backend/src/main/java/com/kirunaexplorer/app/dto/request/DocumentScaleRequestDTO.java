package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

public record DocumentScaleRequestDTO(
    @Null(groups = {PostDocumentScale.class})
    Long id,

    @NotNull
    @Size(min = 2, max = 64)
    String scale
) {


    /**
     * Converts the DocumentScaleRequestDTO to a Document object.
     *
     * @return DocumentScale object
     */
    public DocumentScale toDocumentScale() {
        return new DocumentScale(
            id,
            scale
        );
    }


}
