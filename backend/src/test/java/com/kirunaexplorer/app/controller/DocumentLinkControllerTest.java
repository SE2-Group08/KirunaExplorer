package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefLinksResponseDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.service.DocumentLinkService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class DocumentLinkControllerTest {

    private DocumentLinkService documentLinkService;
    private DocumentLinkController controller;

    @BeforeEach
    void setUp() {
        documentLinkService = mock(DocumentLinkService.class);
        controller = new DocumentLinkController(documentLinkService);
    }

    @Test
    void testLinkDocuments() {
        Long documentId = 1L;
        LinkDocumentsRequestDTO request = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, 2L);
        LinkDocumentsResponseDTO responseDTO = new LinkDocumentsResponseDTO(100L);

        // Mock del servizio
        when(documentLinkService.linkDocuments(eq(documentId), eq(request))).thenReturn(responseDTO);

        // Configura un contesto della richiesta simulato
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/v1/documents/1/links");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        // Chiamata al controller
        ResponseEntity<Void> response = controller.linkDocuments(documentId, request);

        // Assert
        assertEquals(201, response.getStatusCodeValue());
        assertNotNull(response.getHeaders().getLocation());
        assertEquals("/api/v1/documents/1/links/100", response.getHeaders().getLocation().getPath());

        // Pulisce il contesto della richiesta
        RequestContextHolder.resetRequestAttributes();
    }


    @Test
    void testUpdateLink() {
        LinkDocumentsRequestDTO request = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, 100L, null);

        ResponseEntity<Void> response = controller.updateLink(request);

        assertEquals(204, response.getStatusCodeValue());
        verify(documentLinkService).updateLink(request);
    }

    @Test
    void testDeleteLink() {
        Long linkId = 1L;

        ResponseEntity<Void> response = controller.deleteLink(linkId);

        assertEquals(204, response.getStatusCodeValue());
        verify(documentLinkService).deleteLink(linkId);
    }

    @Test
    void testGetDocumentLinks() {
        Long documentId = 1L;
        List<DocumentBriefLinksResponseDTO> expectedLinks = Collections.emptyList();
        when(documentLinkService.getDocumentLinks(documentId)).thenReturn(expectedLinks);

        ResponseEntity<List<DocumentBriefLinksResponseDTO>> response = controller.getDocumentLinks(documentId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedLinks, response.getBody());
    }
}
