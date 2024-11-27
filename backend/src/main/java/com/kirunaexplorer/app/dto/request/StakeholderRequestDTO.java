package com.kirunaexplorer.app.dto.request;

import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.validation.groups.stakeholder.PostStakeholder;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

public record StakeholderRequestDTO(
    @Null(groups = {PostStakeholder.class})
    Long id,

    @NotNull
    @Size(min = 2, max = 64)
    String name
    ) {
    /***
     * Converts the StakeholderRequestDTO to a Stakeholder object.
     * @return Stakeholder object
     */
    public Stakeholder toStakeholder() {
        return new Stakeholder(
            id,
            name
        );
    }
}
