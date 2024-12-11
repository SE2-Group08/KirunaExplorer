package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.constants.DocumentLinkType;
import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefLinksResponseDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
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

        private LinkDocumentsRequestDTO request;
        private DocumentLink documentLink;

        @BeforeEach
        void setUp() {
            request = new LinkDocumentsRequestDTO(DocumentLinkType.DIRECT_CONSEQUENCE, 1L, 2L);
            documentLink = new DocumentLink();
            documentLink.setId(1L);
            documentLink.setType(DocumentLinkType.DIRECT_CONSEQUENCE);
        }

        /**
         * Test the updateLink method with a successful scenario
         */
        @Test
        void testUpdateLink_successful() {
            when(documentLinkRepository.findById(request.linkId())).thenReturn(Optional.of(documentLink));

            documentLinkService.updateLink(request);

            verify(documentLinkRepository, times(1)).save(documentLink);
            assertEquals(DocumentLinkType.DIRECT_CONSEQUENCE, documentLink.getType(), "The document link type should be updated");
        }

        /**
         * Test the updateLink method when the document link is not found
         */
        @Test
        void testUpdateLink_documentLinkNotFound() {
            when(documentLinkRepository.findById(request.linkId())).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class, () -> documentLinkService.updateLink(request), "Expected ResourceNotFoundException when document link is not found");
        }
    }

    @Nested
    class DeleteLinkTests {

        private Long linkId;
        private DocumentLink documentLink;

        @BeforeEach
        void setUp() {
            linkId = 1L;
            documentLink = new DocumentLink();
            documentLink.setId(linkId);
        }

        /**
         * Test the deleteLink method with a successful scenario
         */
        @Test
        void testDeleteLink_successful() {
            when(documentLinkRepository.findById(linkId)).thenReturn(Optional.of(documentLink));

            documentLinkService.deleteLink(linkId);

            verify(documentLinkRepository, times(1)).delete(documentLink);
        }

        /**
         * Test the deleteLink method when the document link is not found
         */
        @Test
        void testDeleteLink_documentLinkNotFound() {
            when(documentLinkRepository.findById(linkId)).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class, () -> documentLinkService.deleteLink(linkId), "Expected ResourceNotFoundException when document link is not found");
        }
    }

    @Nested
    class GetDocumentLinksTests {

        private Long documentId;
        private Document document;
        private DocumentLink documentLink;
        private List<DocumentLink> documentLinks;

        @BeforeEach
        void setUp() {
            documentId = 1L;
            document = new Document();
            document.setId(documentId);
            document.setStakeholders("");

            Document linkedDocument = new Document();
            linkedDocument.setId(2L);

            documentLink = new DocumentLink();
            documentLink.setId(1L);
            documentLink.setDocument(document);
            documentLink.setLinkedDocument(linkedDocument);
            documentLink.setType(DocumentLinkType.DIRECT_CONSEQUENCE);

            documentLinks = List.of(documentLink);
        }

        /**
         * Test the getDocumentLinks method with a successful scenario
         */
        @Test
        void testGetDocumentLinks_successful() {
            // Create the main document
            document.setStakeholders("stakeholder1/stakeholder2");
            document.setDatePrecision(Document.DatePrecision.FULL_DATE);
            document.setIssuanceDate(LocalDate.now());
            document.setGeoReference(new GeoReference());

            // Create the linked documents
            Document linkedDocument1 = new Document();
            linkedDocument1.setId(2L);
            linkedDocument1.setStakeholders("stakeholder3/stakeholder4");
            linkedDocument1.setDatePrecision(Document.DatePrecision.FULL_DATE);
            linkedDocument1.setIssuanceDate(LocalDate.now());
            linkedDocument1.setGeoReference(new GeoReference());

            Document linkedDocument2 = new Document();
            linkedDocument2.setId(3L);
            linkedDocument2.setStakeholders("stakeholder5/stakeholder6");
            linkedDocument2.setDatePrecision(Document.DatePrecision.FULL_DATE);
            linkedDocument2.setIssuanceDate(LocalDate.now());
            linkedDocument2.setGeoReference(new GeoReference());

            // Create the document links
            DocumentLink documentLink1 = new DocumentLink();
            documentLink1.setId(1L);
            documentLink1.setDocument(document);
            documentLink1.setLinkedDocument(linkedDocument1);
            documentLink1.setType(DocumentLinkType.DIRECT_CONSEQUENCE);

            DocumentLink documentLink2 = new DocumentLink();
            documentLink2.setId(2L);
            documentLink2.setDocument(document);
            documentLink2.setLinkedDocument(linkedDocument2);
            documentLink2.setType(DocumentLinkType.COLLATERAL_CONSEQUENCE);

            documentLinks = List.of(documentLink1, documentLink2);

            // Mock the repository methods
            when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
            when(documentLinkRepository.findByDocumentOrLinkedDocument(document, document)).thenReturn(documentLinks);

            // Call the service method
            List<DocumentBriefLinksResponseDTO> response = documentLinkService.getDocumentLinks(documentId);

            // Verify the results
            assertNotNull(response, "The response should not be null");
            assertEquals(2, response.size(), "The response size should be 2");
            verify(documentLinkRepository, times(1)).findByDocumentOrLinkedDocument(document, document);
        }

        /**
         * Test the getDocumentLinks method when the document is not found
         */
        @Test
        void testGetDocumentLinks_documentNotFound() {
            when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

            assertThrows(ResourceNotFoundException.class, () -> documentLinkService.getDocumentLinks(documentId), "Expected ResourceNotFoundException when document is not found");
        }
    }
}