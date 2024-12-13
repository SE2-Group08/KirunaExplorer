package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.constraints.*;

public record DocumentScaleRequestDTO(
    @Null(groups = {PostDocumentScale.class}, message = "id must be not null")
    Long id,

    @NotNull(message = "scale must be not null")
    @Size(min = 2, max = 64, message = "invalid size for scale")
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
