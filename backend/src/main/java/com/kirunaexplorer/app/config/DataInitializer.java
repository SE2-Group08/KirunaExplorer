package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.constants.DocumentLinkType;
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
    private final DocumentLinkRepository documentLinkRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DataInitializer(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        AreaRepository areaRepository,
        PointCoordinatesRepository pointCoordinatesRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentLinkRepository documentLinkRepository,
        DocumentScaleRepository documentScaleRepository
    ) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.areaRepository = areaRepository;
        this.pointCoordinatesRepository = pointCoordinatesRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentLinkRepository = documentLinkRepository;
        this.documentScaleRepository = documentScaleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
       // initializeStakeholders();
       // initializeDocumentTypes();
      //  initializeDocumentScales();
    }


    private void addNewDocument(int documentNumber) {
        Document document = new Document(null,
            "Construction of Scandic Hotel begins - Document " + documentNumber,
            "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
            "LKAB",
            "Material effect",
            "Blueprint/Material effects",
            LocalDate.of(2019, 4, 19),
            DatePrecision.FULL_DATE,
            null,
            null,
            LocalDateTime.now(),
            null,
            new HashSet<>(),
            null,
            new HashSet<>());

        document = documentRepository.save(document);

        GeoReference geoRef = new GeoReference(
            null,
            document,
            false,
            geometryFactory.createPoint(new Coordinate(20.2500, 67.9000)) // Specific location
        );
        geoReferenceRepository.save(geoRef);
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