package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Table(name = "GEO_REFERENCE")
public class GeoReference {

    @Id
    @Column(name = "document_id") // Primary key and foreign key
    private Long documentId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private Area area;

    @ManyToOne
    @JoinColumn(name = "point_coordinates_id")
    private PointCoordinates pointCoordinates;


    public GeoReference(Document document, Area area, PointCoordinates pointCoordinates) {
        this.document = document;
        this.area = area;
        this.pointCoordinates = pointCoordinates;
    }

    public GeoReference(Long id, Document document) {
        this.documentId = id;
        this.document = document;
    }

    public void setArea(Area area) {
        this.area = area;
        this.pointCoordinates = null;
    }

    public void setPointCoordinates(PointCoordinates pointCoordinates) {
        this.pointCoordinates = pointCoordinates;
        this.area = null;
    }

    public GeoReferenceDTO toGeolocationDTO() {
        if (area != null) {
            return new GeoReferenceDTO(area.toAreaBriefDTO(), null);
        }
        if (pointCoordinates != null) {
            return new GeoReferenceDTO(null, pointCoordinates.toPointCoordinatesDTO());
        }
        return new GeoReferenceDTO(null, null);
    }
}