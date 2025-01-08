package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.service.DocumentScaleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DocumentScaleControllerTest {

    private final DocumentScaleService mockService = Mockito.mock(DocumentScaleService.class);
    private final DocumentScaleController controller = new DocumentScaleController(mockService);

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    void testGetAllDocumentsWithResults() {
        List<DocumentScaleResponseDTO> mockResponse = List.of(
                new DocumentScaleResponseDTO(1, "Mock Scale 1"),
                new DocumentScaleResponseDTO(2, "Mock Scale 2")
        );

        when(mockService.getAllDocumentScales()).thenReturn(mockResponse);

        ResponseEntity<List<DocumentScaleResponseDTO>> response = controller.getAllDocuments();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockResponse, response.getBody());
    }

    @Test
    void testGetAllDocumentsEmptyList() {
        when(mockService.getAllDocumentScales()).thenReturn(Collections.emptyList());

        ResponseEntity<List<DocumentScaleResponseDTO>> response = controller.getAllDocuments();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testCreateDocumentWithValidRequest() {
        Long mockId = 123L;
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "Valid Scale");

        when(mockService.createDocumentScale(any(DocumentScaleRequestDTO.class))).thenReturn(mockId);

        ResponseEntity<Void> response = controller.createDocument(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("http://localhost/123", response.getHeaders().getLocation().toString());

        verify(mockService).createDocumentScale(any(DocumentScaleRequestDTO.class)); // Verifica che il metodo sia chiamato
    }

    @Test
    void testCreateDocumentWithServiceException() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(null, "Valid Scale");

        doThrow(new RuntimeException("Service failed")).when(mockService).createDocumentScale(any());

        try {
            controller.createDocument(request);
        } catch (RuntimeException ex) {
            assertEquals("Service failed", ex.getMessage());
        }
    }
}
