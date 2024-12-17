package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Area;
import com.kirunaexplorer.app.validation.groups.area.PostArea;
import com.kirunaexplorer.app.validation.groups.document.PostDocument;
import com.kirunaexplorer.app.validation.groups.document.PutDocument;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.groups.Default;

public record AreaBriefDTO(
    @Null(groups = {PostArea.class})
    @NotNull(groups = {PostDocument.class, PutDocument.class})
    Long areaId,

    @NotNull(groups = {PostArea.class})
    @Null(groups = {PostDocument.class, PutDocument.class})
    String areaName,

    @Valid
    @NotNull(groups = {PostArea.class})
    @Null(groups = {PostDocument.class, PutDocument.class})
    CoordinatesDTO areaCentroid
) {
    public Area toArea() {
        return new Area(
            areaId,
            areaName,
            areaCentroid.toCoordinates(),
            null
        );
    }
}
