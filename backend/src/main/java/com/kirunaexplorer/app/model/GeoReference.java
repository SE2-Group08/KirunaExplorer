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

    private boolean isEntireMunicipality; // True if it refers to the whole municipality

    @Column(columnDefinition = "geography(Point, 4326)", nullable = true)
    private Point location; // Nullable, used only for specific point

    public GeoReference(Long documentId, Document document) {
        this.documentId = documentId;
        this.document = document;
    }

    public GeoReference(Document document, boolean isEntireMunicipality, Point location) {
        this.document = document;
        this.isEntireMunicipality = isEntireMunicipality;
        this.location = location;
    }

    /**
     * Converts the GeoReference object to a GeoReferenceDTO object.
     *
     * @return GeoReferenceDTO object
     */
    public GeoReferenceDTO toGeolocationDTO() {
        return new GeoReferenceDTO(
            location != null ? location.getY() : null,
            location != null ? location.getX() : null,
            isEntireMunicipality ? "Entire municipality" : null
        );
    }

    public void updateFromDTO(GeoReferenceDTO geoDTO) {
        this.isEntireMunicipality = geoDTO.municipality() != null;
        this.location = geoDTO.municipality() == null ? geoDTO.createPoint(geoDTO.latitude(), geoDTO.longitude()) : null;
    }
}
