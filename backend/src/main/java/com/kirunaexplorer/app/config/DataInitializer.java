package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.repository.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final AreaRepository areaRepository;
    private final PointCoordinatesRepository pointCoordinatesRepository;
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DataInitializer(
            DocumentRepository documentRepository,
            GeoReferenceRepository geoReferenceRepository,
            AreaRepository areaRepository,
            PointCoordinatesRepository pointCoordinatesRepository,
            StakeholderRepository stakeholderRepository,
            DocumentTypeRepository documentTypeRepository,
            DocumentScaleRepository documentScaleRepository) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.areaRepository = areaRepository;
        this.pointCoordinatesRepository = pointCoordinatesRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeStakeholders();
        initializeDocumentTypes();
        initializeDocumentScales();

        // Initialize Areas
        Area area1 = areaRepository.save(new Area(
                null,
                "AAAAAAAA",
                new Coordinates(69.0, 20.0),
                new Geometry(GeometryType.POLYGON, List.of(new Coordinates(69.0, 20.0), new Coordinates(69.0, 21.0),
                        new Coordinates(70.0, 21.0), new Coordinates(70.0, 20.0)))));

        Area area2 = areaRepository.save(new Area(
                null,
                "BBBBB",
                new Coordinates(68.0, 21.0),
                new Geometry(GeometryType.POLYGON, List.of(new Coordinates(68.0, 21.0), new Coordinates(68.5, 21.5),
                        new Coordinates(68.8, 21.8)))));

        // Initialize Point Coordinates
        PointCoordinates point1 = pointCoordinatesRepository.save(new PointCoordinates(
                null,
                "Cool new point",
                69.0,
                20.0));

        PointCoordinates point2 = pointCoordinatesRepository.save(new PointCoordinates(
                null,
                "Cool new point 2",
                68.5,
                20.5));

        // Create Documents and associate GeoReferences
        Document document1 = documentRepository.save(new Document(null,
                "Compilation of responses",
                "Summary of citizen responses about Kiruna Church and Town Hall.",
                "Kiruna kommun/Residents",
                "Informative document",
                "1:1",
                LocalDate.of(2007, 1, 1),
                Document.DatePrecision.YEAR_ONLY,
                "Swedish",
                5,
                LocalDateTime.now(),
                null,
                new HashSet<>(),
                null,
                new HashSet<>()));

        GeoReference geoRef1 = new GeoReference(document1, area1, null);
        geoReferenceRepository.save(geoRef1);

        Document document2 = documentRepository.save(new Document(null,
                "Detailed plan for Bolagsomradet Gruvstadspark",
                "Detailed transformation of residential areas into mining zones.",
                "Kiruna kommun",
                "Prescriptive document",
                "1:8000",
                LocalDate.of(2010, 10, 20),
                Document.DatePrecision.FULL_DATE,
                "Swedish",
                32,
                LocalDateTime.now(),
                null,
                new HashSet<>(),
                null,
                new HashSet<>()));

        GeoReference geoRef2 = new GeoReference(document2, null, point1);
        geoReferenceRepository.save(geoRef2);

        Document document3 = documentRepository.save(new Document(null,
                "Development Plan",
                "Shaping the new city through strategies and diagrams.",
                "Kiruna kommun/White Arkitekter",
                "Design document",
                "1:7500",
                LocalDate.of(2014, 3, 17),
                Document.DatePrecision.FULL_DATE,
                "Swedish",
                111,
                LocalDateTime.now(),
                null,
                new HashSet<>(),
                null,
                new HashSet<>()));

        GeoReference geoRef3 = new GeoReference(document3, area2, null);
        geoReferenceRepository.save(geoRef3);

        Document document4 = documentRepository.save(new Document(null,
                "Deformation forecast",
                "Forecast for deformation analysis in Kiruna region.",
                "LKAB",
                "Technical document",
                "1:12000",
                LocalDate.of(2014, 12, 1),
                Document.DatePrecision.FULL_DATE,
                "Swedish",
                1,
                LocalDateTime.now(),
                null,
                new HashSet<>(),
                null,
                new HashSet<>()));

        GeoReference geoRef4 = new GeoReference(document4, null, point2);
        geoReferenceRepository.save(geoRef4);

        // Add more documents and GeoReferences as needed
    }

    private void initializeStakeholders() {
        stakeholderRepository.save(new Stakeholder(null, "Kiruna kommun"));
        stakeholderRepository.save(new Stakeholder(null, "Residents"));
        stakeholderRepository.save(new Stakeholder(null, "White Arkitekter"));
        stakeholderRepository.save(new Stakeholder(null, "LKAB"));
    }

    private void initializeDocumentTypes() {
        documentTypeRepository.save(new DocumentType(null, "Informative document"));
        documentTypeRepository.save(new DocumentType(null, "Design document"));
        documentTypeRepository.save(new DocumentType(null, "Technical document"));
        documentTypeRepository.save(new DocumentType(null, "Prescriptive document"));
        documentTypeRepository.save(new DocumentType(null, "Material effect"));
    }

    private void initializeDocumentScales() {
        documentScaleRepository.save(new DocumentScale(null, "Text"));
        documentScaleRepository.save(new DocumentScale(null, "Blueprints/Material effects"));
    }
}