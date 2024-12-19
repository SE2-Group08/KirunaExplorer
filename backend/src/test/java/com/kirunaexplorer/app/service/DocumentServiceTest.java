package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.GeoReferenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentServiceTest {

    @InjectMocks
    private DocumentService documentService;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private GeoReferenceRepository geoReferenceRepository;

    @Mock
    private DocumentLinkRepository documentLinkRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllDocuments_ShouldReturnListOfDocumentBriefResponseDTO() {
        Document mockDocument = mock(Document.class);
        DocumentBriefResponseDTO briefResponseDTO = new DocumentBriefResponseDTO(1L, "Sample Title", null, "1:100", null, "", null);

        when(documentRepository.findAll()).thenReturn(List.of(mockDocument));
        when(mockDocument.toDocumentBriefResponseDTO()).thenReturn(briefResponseDTO);

        List<DocumentBriefResponseDTO> result = documentService.getAllDocuments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(briefResponseDTO, result.get(0));
        verify(documentRepository, times(1)).findAll();
    }

    @Test
    void getDocumentById_ShouldReturnDocumentResponseDTO() {
        Document mockDocument = mock(Document.class);
        GeoReferenceDTO mockGeoReference = mock(GeoReferenceDTO.class);
        String issuanceDate = "2023-01-01";

        when(documentRepository.findById(1L)).thenReturn(Optional.of(mockDocument));
        when(documentLinkRepository.countByDocumentId(1L)).thenReturn(5);
        when(mockDocument.getId()).thenReturn(1L);
        when(mockDocument.getTitle()).thenReturn("Sample Title");
        when(mockDocument.getStakeholders()).thenReturn(List.of(new Stakeholder("Stakeholder A"), new Stakeholder("Stakeholder B")));
        when(mockDocument.getScale()).thenReturn("National");
        when(mockDocument.getIssuanceDate()).thenReturn(LocalDate.parse(issuanceDate));
        when(mockDocument.getType()).thenReturn("Report");
        when(mockDocument.getLanguage()).thenReturn("English");
        when(mockDocument.getPages()).thenReturn(100);
        when(mockDocument.getDescription()).thenReturn("Sample description");
        // when(mockDocument.getGeoReference()).thenReturn(mockGeoReference);

        DocumentResponseDTO expectedResponse = new DocumentResponseDTO(
            1,
            "Sample Title",
            List.of("Stakeholder A", "Stakeholder B"),
            "National",
            issuanceDate,
            "Report",
            5,
            "English",
            100,
            mockGeoReference,
            "Sample description"
        );

        when(mockDocument.toDocumentResponseDTO(5)).thenReturn(expectedResponse);

        DocumentResponseDTO result = documentService.getDocumentById(1L);

        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(documentRepository, times(1)).findById(1L);
        verify(documentLinkRepository, times(1)).countByDocumentId(1L);
    }

    @Test
    void getDocumentById_ShouldThrowResourceNotFoundException() {
        when(documentRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ResourceNotFoundException.class,
            () -> documentService.getDocumentById(1L));

        assertEquals("Document not found with ID 1", exception.getMessage());
        verify(documentRepository, times(1)).findById(1L);
    }

    /*@Test
    void createDocument_ShouldReturnDocumentId() {
        DocumentRequestDTO mockRequestDTO = mock(DocumentRequestDTO.class);
        Document mockDocument = mock(Document.class);
        GeoReferenceDTO mockGeoReferenceDTO = mock(GeoReferenceDTO.class);

        when(mockRequestDTO.toDocument()).thenReturn(mockDocument);
        when(mockRequestDTO.geolocation()).thenReturn(mockGeoReferenceDTO);
        when(mockDocument.getId()).thenReturn(1L);
        when(documentRepository.save(mockDocument)).thenReturn(mockDocument);

        Long result = documentService.createDocument(mockRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result);
        verify(documentRepository, times(1)).save(mockDocument);
        verify(geoReferenceRepository, times(1)).save(any());
    }*/

    /*@Test
    void updateDocument_ShouldUpdateExistingDocument() {
        DocumentRequestDTO mockRequestDTO = mock(DocumentRequestDTO.class);
        Document mockDocument = mock(Document.class);
        GeoReferenceDTO mockGeoReferenceDTO = mock(GeoReferenceDTO.class);

        when(mockRequestDTO.id()).thenReturn(0L);
        when(documentRepository.findById(0L)).thenReturn(Optional.of(mockDocument));
        when(mockRequestDTO.geolocation()).thenReturn(mockGeoReferenceDTO);

        documentService.updateDocument(mockRequestDTO);

        verify(mockDocument, times(1)).updateFromDocumentRequestDTO(mockRequestDTO);
        verify(documentRepository, times(1)).save(mockDocument);
        verify(geoReferenceRepository, times(1)).findById(0L);
        verify(geoReferenceRepository, times(1)).save(any());
    }*/

    @Test
    void updateDocument_ShouldThrowResourceNotFoundException() {
        DocumentRequestDTO mockRequestDTO = mock(DocumentRequestDTO.class);

        when(mockRequestDTO.id()).thenReturn(1L);
        when(documentRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ResourceNotFoundException.class,
            () -> documentService.updateDocument(mockRequestDTO));

        assertEquals("Document not found with ID 1", exception.getMessage());
        verify(documentRepository, times(1)).findById(1L);
        verify(documentRepository, never()).save(any());
    }
}
