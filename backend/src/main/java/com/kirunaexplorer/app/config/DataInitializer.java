package com.kirunaexplorer.app.config;

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
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DataInitializer(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentLinkRepository documentLinkRepository,
        DocumentScaleRepository documentScaleRepository
    ) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {



    }





}
