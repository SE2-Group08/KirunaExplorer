package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.GeoReferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class DBService {
    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final DocumentLinkRepository documentLinkRepository;

    public DBService(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        DocumentLinkRepository documentLinkRepository
    ) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.documentLinkRepository = documentLinkRepository;
    }

    public void clearDB() {
        documentLinkRepository.deleteAll();
        documentRepository.deleteAll();
        geoReferenceRepository.deleteAll();
    }
}
