package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentLinkServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DocumentLinkRepository documentLinkRepository;

    @InjectMocks
    private DocumentLinkService documentLinkService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Nested
    class LinkDocumentsTests {

        private Long documentId;
        private Long linkedDocumentId;
        private LinkDocumentsRequestDTO request;
        private Document document;
        private Document linkedDocument;
        private DocumentLink documentLink;

        @BeforeEach
        void setUp() {
            documentId = 1L;
            linkedDocumentId = 2L;
            request = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, linkedDocumentId);

            document = new Document();
            document.setId(documentId);

            linkedDocument = new Document();
            linkedDocument.setId(linkedDocumentId);

            documentLink = new DocumentLink();
            documentLink.setId(1L);
        }

        /**
         * Test the linkDocuments method with a successful scenario
         */
        @Test
        void testLinkDocuments_successful() {
            when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
            when(documentRepository.findById(linkedDocumentId)).thenReturn(Optional.of(linkedDocument));
            when(documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(document, linkedDocument, DocumentLinkType.DIRECT_CONSEQUENCE)).thenReturn(false);
            when(documentLinkRepository.save(any(DocumentLink.class))).thenReturn(documentLink);

            LinkDocumentsResponseDTO response = documentLinkService.linkDocuments(documentId, request);

            assertNotNull(response, "The response should not be null");
            assertEquals(1L, response.linkId(), "The link ID should be 1");
            verify(documentLinkRepository, times(1)).save(any(DocumentLink.class));
        }

        /**
         * Test the linkDocuments method when the document is not found from the path variable
         */
        @Test
        void testLinkDocuments_documentNotFoundFromPathVariable() {
            when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class, () -> documentLinkService.linkDocuments(documentId, request), "Expected ResourceNotFoundException when document is not found");
        }

        /**
         * Test the linkDocuments method when the document is not found from the payload request
         */
        @Test
        void testLinkDocuments_documentNotFoundFromPayloadRequest() {
            when(documentRepository.findById(linkedDocumentId)).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class, () -> documentLinkService.linkDocuments(documentId, request), "Expected ResourceNotFoundException when document is not found");
        }

        /**
         * Test the linkDocuments method when the document is linked to itself
         */
        @Test
        void testLinkDocuments_sameDocument() {
            request = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, null, documentId);

            when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> documentLinkService.linkDocuments(documentId, request), "Expected IllegalArgumentException when linking a document to itself");
            assertEquals("Cannot link a document to itself", exception.getMessage());
        }

        /**
         * Test the linkDocuments method when the link already exists in one order
         */
        @Test
        void testLinkDocuments_linkAlreadyExists() {
            when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
            when(documentRepository.findById(linkedDocumentId)).thenReturn(Optional.of(linkedDocument));
            when(documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(document, linkedDocument, DocumentLinkType.DIRECT_CONSEQUENCE)).thenReturn(true);

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> documentLinkService.linkDocuments(documentId, request), "Expected IllegalArgumentException when link already exists");
            assertEquals("Link between the documents already exists with the same type", exception.getMessage());
        }

        /**
         * Test the linkDocuments method when the link already exists in the other order
         */
        @Test
        void testLinkDocuments_linkAlreadyExistsTheOtherOrder() {
            when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
            when(documentRepository.findById(linkedDocumentId)).thenReturn(Optional.of(linkedDocument));
            when(documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(linkedDocument, document, DocumentLinkType.DIRECT_CONSEQUENCE)).thenReturn(true);

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> documentLinkService.linkDocuments(documentId, request), "Expected IllegalArgumentException when link already exists in the other order");
            assertEquals("Link between the documents already exists with the same type", exception.getMessage());
        }
    }

    @Nested
    class UpdateLinkTests {

        @Test
        void testUpdateLink() {
            // Add tests for updateLink method
        }

        // Add more tests for other scenarios
    }

    @Nested
    class DeleteLinkTests {

        @Test
        void testDeleteLink() {
            // Add tests for deleteLink method
        }

        // Add more tests for other scenarios
    }

    @Nested
    class GetDocumentLinksTests {

        @Test
        void testGetDocumentLinks() {
            // Add tests for getDocumentLinks method
        }

        // Add more tests for other scenarios
    }
}