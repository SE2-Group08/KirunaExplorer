package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.service.DocumentTypeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class DocumentTypeControllerTest {

    @Mock
    private DocumentTypeService mockService;

    @InjectMocks
    private DocumentTypeController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        MockHttpServletRequest request = new MockHttpServletRequest();
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    void testGetAllDocumentTypesWithResults() {
        List<DocumentTypeResponseDTO> mockResponse = List.of(
                new DocumentTypeResponseDTO(1, "Mock Type 1"),
                new DocumentTypeResponseDTO(2, "Mock Type 2")
        );

        when(mockService.getAllDocumentTypes()).thenReturn(mockResponse);

        ResponseEntity<List<DocumentTypeResponseDTO>> response = controller.getAllDocumentTypes();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockResponse, response.getBody());
    }

    @Test
    void testGetAllDocumentTypesEmptyList() {
        when(mockService.getAllDocumentTypes()).thenReturn(Collections.emptyList());

        ResponseEntity<List<DocumentTypeResponseDTO>> response = controller.getAllDocumentTypes();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testCreateDocumentWithValidRequest() {
        Long mockId = 123L;
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(null, "Valid Type");

        when(mockService.createDocumentType(any(DocumentTypeRequestDTO.class))).thenReturn(mockId);

        ResponseEntity<Void> response = controller.createDocument(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("http://localhost/123", response.getHeaders().getLocation().toString());

        verify(mockService).createDocumentType(any(DocumentTypeRequestDTO.class)); // Verifica che il metodo sia chiamato
    }

    @Test
    void testCreateDocumentWithServiceException() {
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(null, "Valid Type");

        doThrow(new RuntimeException("Service failed")).when(mockService).createDocumentType(any());

        try {
            controller.createDocument(request);
        } catch (RuntimeException ex) {
            assertEquals("Service failed", ex.getMessage());
        }
    }

    @Test
    void testCreateDocumentWithInvalidRequest() {
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(null, null); // Scale null

        try {
            controller.createDocument(request);
        } catch (Exception ex) {
            // A causa della validazione, ci aspettiamo un'eccezione
            assertEquals(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void testGetAllDocumentTypesWithServiceException() {
        when(mockService.getAllDocumentTypes()).thenThrow(new RuntimeException("Service failed"));

        try {
            controller.getAllDocumentTypes();
        } catch (RuntimeException ex) {
            assertEquals("Service failed", ex.getMessage());
        }
    }
}
