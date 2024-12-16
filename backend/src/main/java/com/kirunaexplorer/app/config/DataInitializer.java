package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.model.Document.DatePrecision;
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
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final AreaRepository areaRepository;
    private final PointCoordinatesRepository pointCoordinatesRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DataInitializer(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentScaleRepository documentScaleRepository,
        AreaRepository areaRepository,
        PointCoordinatesRepository pointCoordinatesRepository
    ) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
        this.areaRepository = areaRepository;
        this.pointCoordinatesRepository = pointCoordinatesRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        areaRepository.save(new Area(
            null,
            "AAAAAAAA",
            new Coordinates(69.0, 20.0),
            new Geometry(GeometryType.POLYGON, List.of(new Coordinates(69.0, 20.0), new Coordinates(69.0, 21.0), new Coordinates(70.0, 21.0), new Coordinates(70.0, 20.0)))
        ));

        pointCoordinatesRepository.save(new PointCoordinates(
            null,
            "Cool new point",
            69.0,
            20.0
        ));

        pointCoordinatesRepository.save(new PointCoordinates(
            null,
            "Cool new point 2",
            69.0,
            20.0
        ));

        pointCoordinatesRepository.save(new PointCoordinates(
            null,
            null,
            69.0,
            20.0
        ));

//        initializeStakeholders();
//        initializeDocumentType();
//        initializeDocumentScale();
//
//
//        Document document1 = new Document(null,
//            "Compilation of responses 'So what the people of Kiruna think?'",
//            "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgärden, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
//            "Kiruna kommun/Residents",
//            "Informative document",
//            "1:1",
//            LocalDate.of(2007, 1, 1),
//            DatePrecision.YEAR_ONLY,
//            "Swedish",
//            5,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document1 = documentRepository.save(document1); // Save first to generate ID
//
//        GeoReference geoRef1 = new GeoReference(
//            null,
//            document1,
//            true,
//            null // No specific point as it references the entire municipality
//        );
//        geoReferenceRepository.save(geoRef1);
//
//
//        Document document2 = new Document(null,
//            "Detailed plan for Bolagsomradet Gruvstadspark",
//            "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the AlO highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
//            "Kiruna kommun",
//            "Prescriptive document",
//            "1:8000",
//            LocalDate.of(2010, 10, 20),
//            Document.DatePrecision.FULL_DATE,
//            "Swedish",
//            32,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//        document2 = documentRepository.save(document2);
//
//        GeoReference geoRef2 = new GeoReference(
//            null,
//            document2,
//            false,
//            geometryFactory.createPoint(new Coordinate(20.2732, 67.8558)) // Specific location
//        );
//        geoReferenceRepository.save(geoRef2);
//
//        Document document3 = new Document(null,
//            "Development Plan",
//            "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
//            "Kiruna kommun/White Arkitekter",
//            "Design document",
//            "1:7500",
//            LocalDate.of(2014, 3, 17),
//            DatePrecision.FULL_DATE,
//            "Swedish",
//            111,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document3 = documentRepository.save(document3);
//
//        GeoReference geoRef3 = new GeoReference(
//            null,
//            document3,
//            false,
//            geometryFactory.createPoint(new Coordinate(20.3201, 67.8514)) // Specific location
//        );
//        geoReferenceRepository.save(geoRef3);
//
//
//        Document document4 = new Document(null,
//            "Deformation forecast",
//            "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
//            "LKAB",
//            "Technical document",
//            "1:12000",
//            LocalDate.of(2014, 12, 1),
//            DatePrecision.FULL_DATE,
//            "Swedish",
//            1,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document4 = documentRepository.save(document4);
//
//        GeoReference geoRef4 = new GeoReference(
//            null,
//            document4,
//            true,
//            null // Entire municipality reference
//        );
//        geoReferenceRepository.save(geoRef4);
//
//        Document document5 = new Document(null,
//            "Adjusted development Plan",
//            "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name Adjusted Development Plan91, and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
//            "Kiruna kommun/White Arkitekter",
//            "Design document",
//            "1:7500",
//            LocalDate.of(2015, 1, 1),
//            DatePrecision.YEAR_ONLY,
//            "Swedish",
//            1,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document5 = documentRepository.save(document5);
//
//        GeoReference geoRef5 = new GeoReference(
//            null,
//            document5,
//            false,
//            geometryFactory.createPoint(new Coordinate(20.3385, 67.8344)) // Specific location
//        );
//        geoReferenceRepository.save(geoRef5);
//
//        Document document6 = new Document(null,
//            "Detail plan for square and commercial street",
//            "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
//            "Kiruna kommun",
//            "Prescriptive document",
//            "1:1000",
//            LocalDate.of(2016, 6, 22),
//            DatePrecision.FULL_DATE,
//            "Swedish",
//            43,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document6 = documentRepository.save(document6);
//
//        GeoReference geoRef6 = new GeoReference(
//            null,
//            document6,
//            true,
//            null // Entire municipality reference
//        );
//        geoReferenceRepository.save(geoRef6);
//
//        Document document7 = new Document(null,
//            "Construction of Scandic Hotel begins",
//            "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
//            "LKAB",
//            "Material effect",
//            "Blueprint/Material effects",
//            LocalDate.of(2019, 4, 19),
//            DatePrecision.FULL_DATE,
//            null,
//            null,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document7 = documentRepository.save(document7);
//
//        GeoReference geoRef7 = new GeoReference(
//            null,
//            document7,
//            false,
//            geometryFactory.createPoint(new Coordinate(20.2500, 67.9000)) // Specific location
//        );
//        geoReferenceRepository.save(geoRef7);
//
//        for (int i = 0; i < 100; i++) {
//            addNewDocument(i);
//        }


    }

//    private void addNewDocument(int documentNumber) {
//        Document document = new Document(null,
//            "Construction of Scandic Hotel begins - Document " + documentNumber,
//            "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
//            "LKAB",
//            "Material effect",
//            "Blueprint/Material effects",
//            LocalDate.of(2019, 4, 19),
//            DatePrecision.FULL_DATE,
//            null,
//            null,
//            LocalDateTime.now(),
//            null,
//            new HashSet<>(),
//            null,
//            new HashSet<>());
//
//        document = documentRepository.save(document);
//
//        GeoReference geoRef = new GeoReference(
//            null,
//            document,
//            false,
//            geometryFactory.createPoint(new Coordinate(20.2500, 67.9000)) // Specific location
//        );
//        geoReferenceRepository.save(geoRef);
//    }
//
//    private void initializeStakeholders() {
//        stakeholderRepository.save(new Stakeholder(null, "Kiruna kommun"));
//        stakeholderRepository.save(new Stakeholder(null, "Residents"));
//        stakeholderRepository.save(new Stakeholder(null, "White Arkitekter"));
//        stakeholderRepository.save(new Stakeholder(null, "LKAB"));
//    }
//
//    private void initializeDocumentType() {
//        documentTypeRepository.save(new DocumentType(null, "Informative document"));
//        documentTypeRepository.save(new DocumentType(null, "Design document"));
//        documentTypeRepository.save(new DocumentType(null, "Technical document"));
//        documentTypeRepository.save(new DocumentType(null, "Prescriptive document"));
//        documentTypeRepository.save(new DocumentType(null, "Material effect"));
//    }
//
//    private void initializeDocumentScale() {
//        documentScaleRepository.save(new DocumentScale(null, "Text"));
//        documentScaleRepository.save(new DocumentScale(null, "blueprints/effects"));
//    }
}
