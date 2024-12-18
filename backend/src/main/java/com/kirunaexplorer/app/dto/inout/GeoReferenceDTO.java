package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.validation.annotation.ValidGeoReference;
import jakarta.validation.Valid;

@ValidGeoReference
public record GeoReferenceDTO(
    @Valid
    AreaBriefDTO area,

    @Valid
    PointCoordinatesDTO pointCoordinates
) {

    public GeoReference toGeoReference(Document document) {
        if (area == null) {
            return new GeoReference(document, null, pointCoordinates.toPointCoordinates());
        }
        if (pointCoordinates == null) {
            return new GeoReference(document, area.toArea(), null);
        }
        return new GeoReference(document, null, null);
    }
}
