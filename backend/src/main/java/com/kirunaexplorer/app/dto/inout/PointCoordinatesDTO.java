package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.PointCoordinates;
import com.kirunaexplorer.app.validation.groups.document.PostDocument;
import com.kirunaexplorer.app.validation.groups.document.PutDocument;
import com.kirunaexplorer.app.validation.groups.point_coordinates.PostPointCoordinates;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record PointCoordinatesDTO(
    @Null(groups = {PostPointCoordinates.class})
    @NotNull(groups = {PostDocument.class, PutDocument.class})
    Long pointId,

    //@NotNull(groups = {PostPointCoordinates.class})
    @Null(groups = {PostDocument.class, PutDocument.class})
    @Size(min = 2, max = 64, groups = {PostPointCoordinates.class})
    String pointName,

    @Valid
    @NotNull(groups = {PostPointCoordinates.class})
    @Null(groups = {PostDocument.class, PutDocument.class})
    CoordinatesDTO coordinates
) {

    public PointCoordinatesDTO(Long pointId, String pointName, double latitude, double longitude) {
        this(pointId, pointName, new CoordinatesDTO(latitude, longitude));
    }

    public PointCoordinates toPointCoordinates() {
        return new PointCoordinates(null, pointName, coordinates.latitude(), coordinates.longitude());
    }
}
