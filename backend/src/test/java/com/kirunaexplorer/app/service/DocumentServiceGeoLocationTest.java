package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DocumentServiceGeoLocationTest {

    private DocumentService documentService;
    private DocumentRepository documentRepository;
    private GeoReferenceRepository geoReferenceRepository;
    private StakeholderRepository stakeholderRepository;
    private DocumentTypeRepository documentTypeRepository;
    private DocumentScaleRepository documentScaleRepository;
    private AreaRepository areaRepository;
    private PointCoordinatesRepository pointCoordinatesRepository;
    private DocumentLinkRepository documentLinkRepository;

    @BeforeEach
    public void setUp() {
        documentRepository = mock(DocumentRepository.class);
        geoReferenceRepository = mock(GeoReferenceRepository.class);
        stakeholderRepository = mock(StakeholderRepository.class);
        documentTypeRepository = mock(DocumentTypeRepository.class);
        documentScaleRepository = mock(DocumentScaleRepository.class);
        areaRepository = mock(AreaRepository.class);
        pointCoordinatesRepository = mock(PointCoordinatesRepository.class);
        documentLinkRepository = mock(DocumentLinkRepository.class);

        documentService = new DocumentService(documentRepository, geoReferenceRepository, documentLinkRepository, stakeholderRepository,
                documentTypeRepository, documentScaleRepository, areaRepository, pointCoordinatesRepository);
    }

    @Test
    public void testStoreGeolocationWithArea() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithArea();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);

        when(areaRepository.findById(documentRequest.geolocation().area().areaId()))
                .thenReturn(Optional.of(new Area(1L, "Test Area", new Coordinates(10.0, 20.0), null)));

        when(documentRepository.save(any(Document.class))).thenReturn(document);

        documentService.createDocument(documentRequest);

        verify(geoReferenceRepository).save(any(GeoReference.class));
    }

    @Test
    public void testStoreGeolocationWithPointCoordinates() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithPointCoordinates();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);

        when(pointCoordinatesRepository.findById(documentRequest.geolocation().pointCoordinates().pointId()))
                .thenReturn(Optional.of(new PointCoordinates(1L, "Test Point", new Coordinates(10.0, 20.0))));

        when(documentRepository.save(any(Document.class))).thenReturn(document);

        documentService.createDocument(documentRequest);

        verify(geoReferenceRepository).save(any(GeoReference.class));
    }

    @Test
    public void testStoreGeolocationWithoutGeolocation() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithoutGeolocation();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);

        when(documentRepository.save(any(Document.class))).thenReturn(document);

        documentService.createDocument(documentRequest);

        verify(geoReferenceRepository).save(any(GeoReference.class));
    }

    @Test
    public void testUpdateGeolocationWithArea() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithArea();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);
        GeoReference geoReference = new GeoReference(document.getId(), document);

        when(areaRepository.findById(documentRequest.geolocation().area().areaId()))
                .thenReturn(Optional.of(new Area(1L, "Test Area", new Coordinates(10.0, 20.0), null)));

        when(documentRepository.findById(documentRequest.id())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentService.updateDocument(documentRequest);

        verify(geoReferenceRepository).save(any(GeoReference.class));
    }

    @Test
    public void testUpdateGeolocationWithPointCoordinates() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithPointCoordinates();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);
        GeoReference geoReference = new GeoReference(document.getId(), document);

        when(pointCoordinatesRepository.findById(documentRequest.geolocation().pointCoordinates().pointId()))
                .thenReturn(Optional.of(new PointCoordinates(1L, "Test Point", new Coordinates(10.0, 20.0))));

        when(documentRepository.findById(documentRequest.id())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentService.updateDocument(documentRequest);

        verify(geoReferenceRepository).save(any(GeoReference.class));
    }

    @Test
    public void testUpdateGeolocationWithoutGeolocation() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithoutGeolocation();
        Document document = createDocumentFromRequest(documentRequest);
        document.setId(1L);
        GeoReference geoReference = new GeoReference(document.getId(), document);

        when(documentRepository.findById(documentRequest.id())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentService.updateDocument(documentRequest);

        verify(documentRepository).save(any(Document.class));
    }

    @Test
    public void testStoreGeolocationWithInvalidArea() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithArea();

        when(areaRepository.findById(documentRequest.geolocation().area().areaId()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> documentService.createDocument(documentRequest));
    }

    @Test
    public void testStoreGeolocationWithInvalidPointCoordinates() {
        DocumentRequestDTO documentRequest = createDocumentRequestWithPointCoordinates();

        when(pointCoordinatesRepository.findById(documentRequest.geolocation().pointCoordinates().pointId()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> documentService.createDocument(documentRequest));
    }

    // Helper methods to create test objects
    private DocumentRequestDTO createDocumentRequestWithArea() {
        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(1L, "Test Area", new CoordinatesDTO(10.0, 20.0));
        GeoReferenceDTO geoReferenceDTO = new GeoReferenceDTO(areaBriefDTO, null);
        List<String> stakeholders = new ArrayList<>(List.of("Stakeholder1", "Stakeholder2"));
        return new DocumentRequestDTO(
                1L,
                "Test Title",
                stakeholders,
                "1:10000",
                "2024-01-01",
                "Test Type",
                0,
                "EN",
                100,
                geoReferenceDTO,
                "Test Description"
        );
    }

    private DocumentRequestDTO createDocumentRequestWithPointCoordinates() {
        PointCoordinatesDTO pointCoordinatesDTO = new PointCoordinatesDTO(1L, "Test Point", 10.0, 20.0);
        GeoReferenceDTO geoReferenceDTO = new GeoReferenceDTO(null, pointCoordinatesDTO);
        List<String> stakeholders = new ArrayList<>(List.of("Stakeholder1", "Stakeholder2"));
        return new DocumentRequestDTO(
                1L,
                "Test Title",
                stakeholders,
                "1:10000",
                "2024-01-01",
                "Test Type",
                0,
                "EN",
                100,
                geoReferenceDTO,
                "Test Description"
        );
    }

    private DocumentRequestDTO createDocumentRequestWithoutGeolocation() {
        List<String> stakeholders = new ArrayList<>(List.of("Stakeholder1", "Stakeholder2"));
        return new DocumentRequestDTO(
                1L,
                "Test Title",
                stakeholders,
                "1:10000",
                "2024-01-01",
                "Test Type",
                0,
                "EN",
                100,
                null,
                "Test Description"
        );
    }

    private Document createDocumentFromRequest(DocumentRequestDTO dto) {
        Document document = new Document(
                dto.id(),
                dto.title(),
                dto.description(),
                String.join("/", dto.stakeholders()),
                dto.type(),
                dto.scale(),
                dto.parseIssuanceDate(dto.issuanceDate()),
                dto.determineDatePrecision(dto.issuanceDate()),
                dto.language(),
                dto.nrPages(),
                LocalDateTime.now(),
                null,
                null,
                null,
                null
        );
        document.setId(dto.id()); // Imposta l'ID del documento per simulare il salvataggio nel repository
        return document;
    }
}
