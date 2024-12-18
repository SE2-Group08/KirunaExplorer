package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.Stakeholder;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

public record StakeholderRequestDTO(
    @Null (message = "id must be null")
    Long id,

    @NotNull(message = "name must be not null")
    @Size(min = 2, max = 64, message = "size error")
    String name
) {
    /**
     * Converts the StakeholderRequestDTO to a Stakeholder object.
     *
     * @return Stakeholder object
     */
    public Stakeholder toStakeholder() {
        return new Stakeholder(
                id,
                name,
                null
        );
    }
}
