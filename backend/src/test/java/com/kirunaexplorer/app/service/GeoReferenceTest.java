package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.GeoReferenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.GeometryFactory;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GeoReferenceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private GeoReferenceRepository geoReferenceRepository;

    @InjectMocks
    private DocumentService documentLinkService; // Replace with your actual service

    private Document document;
    private GeoReference geoReference;
    private GeoReferenceDTO geoReferenceDTO;
    private GeometryFactory geometryFactory;

    @BeforeEach
    void setUp() {
//        geometryFactory = new GeometryFactory();
//
//        document = new Document();
//        document.setId(1L);
//        document.setTitle("Test Document");
//
//        geoReference = new GeoReference();
//        geoReference.setDocumentId(1L);
//        geoReference.setDocument(document);
//        geoReference.setEntireMunicipality(false);
//        geoReference.setLocation(geometryFactory.createPoint(new org.locationtech.jts.geom.Coordinate(21.0, 65.0)));
//
//        geoReferenceDTO = new GeoReferenceDTO(66.0, 22.0, null); // Specific location
    }

    /*@Test
    void shouldUpdateGeoReferenceWithSpecificLocation() {
        DocumentRequestDTO requestDTO = createRequestDTO(geoReferenceDTO);

        when(documentRepository.findById(document.getId())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentLinkService.updateDocument(requestDTO);

        verify(geoReferenceRepository).save(any(GeoReference.class));
        assertNotNull(geoReference.getLocation());
        assertEquals(22.0, geoReference.getLocation().getX());
        assertEquals(66.0, geoReference.getLocation().getY());
        assertFalse(geoReference.isEntireMunicipality());
    }*/

    /*@Test
    void shouldUpdateGeoReferenceToEntireMunicipality() {
        GeoReferenceDTO municipalityDTO = new GeoReferenceDTO(null, null, "Entire municipality");
        DocumentRequestDTO requestDTO = createRequestDTO(municipalityDTO);

        when(documentRepository.findById(document.getId())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentLinkService.updateDocument(requestDTO);

        verify(geoReferenceRepository).save(any(GeoReference.class));
        assertTrue(geoReference.isEntireMunicipality());
        assertNull(geoReference.getLocation());
    }*/

    /*@Test
    void shouldCreateNewGeoReferenceWhenNoneExists() {
        DocumentRequestDTO requestDTO = createRequestDTO(geoReferenceDTO);

        when(documentRepository.findById(document.getId())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.empty());

        documentLinkService.updateDocument(requestDTO);

        verify(geoReferenceRepository).save(any(GeoReference.class));
        GeoReference savedGeoReference = captureGeoReference();
        assertNotNull(savedGeoReference.getLocation());
        assertEquals(22.0, savedGeoReference.getLocation().getX());
        assertEquals(66.0, savedGeoReference.getLocation().getY());
        assertFalse(savedGeoReference.isEntireMunicipality());
    }*/

    /*@Test
    void shouldThrowExceptionWhenDocumentNotFound() {
        DocumentRequestDTO requestDTO = createRequestDTO(geoReferenceDTO);

        when(documentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> documentLinkService.updateDocument(requestDTO));

        verify(geoReferenceRepository, never()).save(any(GeoReference.class));
    }*/

    /*@Test
    void shouldHandleNullGeolocationFields() {
        GeoReferenceDTO nullGeoDTO = new GeoReferenceDTO(null, null, null);
        DocumentRequestDTO requestDTO = createRequestDTO(nullGeoDTO);

        when(documentRepository.findById(document.getId())).thenReturn(Optional.of(document));
        when(geoReferenceRepository.findById(document.getId())).thenReturn(Optional.of(geoReference));

        documentLinkService.updateDocument(requestDTO);

        verify(geoReferenceRepository).save(geoReference);
        assertNull(geoReference.getLocation());
        assertFalse(geoReference.isEntireMunicipality());
    }*/

    private DocumentRequestDTO createRequestDTO(GeoReferenceDTO geoReferenceDTO) {
        return new DocumentRequestDTO(
            document.getId(),
            "Updated Title",
            List.of("Stakeholder A"),
            "1:100",
            null,
            "null",
            0,
            "Swedish",
            150,
            geoReferenceDTO,
            null
        );
    }

    private GeoReference captureGeoReference() {
        ArgumentCaptor<GeoReference> captor = ArgumentCaptor.forClass(GeoReference.class);
        verify(geoReferenceRepository).save(captor.capture());
        return captor.getValue();
    }
}
