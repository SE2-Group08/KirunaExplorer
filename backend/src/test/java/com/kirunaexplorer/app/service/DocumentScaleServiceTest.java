package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.repository.DocumentScaleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class DocumentScaleServiceTest {

    @Mock
    private DocumentScaleRepository documentScaleRepository;

    @InjectMocks
    private DocumentScaleService documentScaleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDocumentScales() {
        DocumentScale mockScale1 = new DocumentScale(1L, "Mock Scale 1");
        DocumentScale mockScale2 = new DocumentScale(2L, "Mock Scale 2");
        List<DocumentScale> mockScales = List.of(mockScale1, mockScale2);

        when(documentScaleRepository.findAll()).thenReturn(mockScales);

        List<DocumentScaleResponseDTO> response = documentScaleService.getAllDocumentScales();

        assertEquals(2, response.size());
        assertEquals("Mock Scale 1", response.get(0).scale());
        assertEquals("Mock Scale 2", response.get(1).scale());
    }

    @Test
    void testGetAllDocumentScalesEmpty() {
        when(documentScaleRepository.findAll()).thenReturn(List.of());

        List<DocumentScaleResponseDTO> response = documentScaleService.getAllDocumentScales();

        assertEquals(0, response.size());
    }

    @Test
    void testCreateDocumentScale() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "New Scale");
        DocumentScale mockScale = new DocumentScale(1L, "New Scale");

        when(documentScaleRepository.save(any(DocumentScale.class))).thenReturn(mockScale);

        Long id = documentScaleService.createDocumentScale(request);

        assertEquals(1L, id);
        verify(documentScaleRepository, times(1)).save(any(DocumentScale.class));
    }

    @Test
    void testCreateDocumentScaleWithException() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "New Scale");

        when(documentScaleRepository.save(any(DocumentScale.class))).thenThrow(new RuntimeException("Save failed"));

        try {
            documentScaleService.createDocumentScale(request);
        } catch (RuntimeException ex) {
            assertEquals("Save failed", ex.getMessage());
        }
    }
}
