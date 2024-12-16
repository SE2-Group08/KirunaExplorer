package com.kirunaexplorer.app.dto.inout;

import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;

//@OneOfGeoReference
public record GeoReferenceDTO(
    AreaBriefDTO area,
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

        //return new GeoReference(document, area.toArea(), pointCoordinates.toPointCoordinates());
    }
}
