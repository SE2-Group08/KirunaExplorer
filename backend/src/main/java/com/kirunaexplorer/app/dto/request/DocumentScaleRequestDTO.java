package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.validation.groups.document_scale.PostDocumentScale;
import jakarta.validation.constraints.*;

public record DocumentScaleRequestDTO(
    @Null(groups = {PostDocumentScale.class})
    Long id,

    @NotNull(message = "scale must be not null", groups = {PostDocumentScale.class})
    @Min(message = "Too short scale", value = 2)
    @Max(message = "Too long scale", value = 64)
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
