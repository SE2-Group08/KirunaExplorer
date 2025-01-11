package com.kirunaexplorer.app.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.DocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

class DocumentSearchTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private GeoReference geoReference = new GeoReference();

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test con keyword e tipo specificati
    @Test
    void testSearchDocuments_withKeywordAndType() {
        // Setup
        String keyword = "example";
        String type = "pdf";
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("Stakeholder 1"));
        Document document = new Document(1L, "example1", "description", stakeholders, type, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(keyword, type, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(keyword, type, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(keyword, type, stakeholderNames, scale, pageable);
    }

    // Test senza keyword e tipo (entrambi null)
    @Test
    void testSearchDocuments_withNoKeywordAndType() {
        // Setup
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("Stakeholder 1"));
        Document document = new Document(1L, "doc1", "description", stakeholders, null, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(null, null, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(null, null, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("doc1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(null, null, stakeholderNames, scale, pageable);
    }

    // Test con keyword specificato ma tipo null
    @Test
    void testSearchDocuments_withKeywordAndNullType() {
        // Setup
        String keyword = "example";
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("Stakeholder 1"));
        Document document = new Document(1L, "example1", "description", stakeholders, null, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(keyword, null, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(keyword, null, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(keyword, null, stakeholderNames, scale, pageable);
    }

    // Test con tipo specificato ma keyword null
    @Test
    void testSearchDocuments_withNullKeywordAndType() {
        // Setup
        String type = "pdf";
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("Stakeholder 1"));
        Document document = new Document(1L, "example1", "description", stakeholders, type, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(null, type, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(null, type, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(null, type, stakeholderNames, scale, pageable);
    }

    // Test senza risultati
    @Test
    void testSearchDocuments_noResults() {
        // Setup
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
        when(documentRepository.searchDocuments("nonexistent", "txt", stakeholderNames, scale, pageable)).thenReturn(emptyPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments("nonexistent", "txt", stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(documentRepository, times(1)).searchDocuments("nonexistent", "txt", stakeholderNames, scale, pageable);
    }

    // Test con documenti nulli nel repository
    @Test
    void testSearchDocuments_repositoryReturnsNull() {
        // Setup
        String keyword = "example";
        String type = "pdf";
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        Pageable pageable = PageRequest.of(0, 16);

        when(documentRepository.searchDocuments(keyword, type, stakeholderNames, scale, pageable)).thenReturn(null);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(keyword, type, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(documentRepository, times(1)).searchDocuments(keyword, type, stakeholderNames, scale, pageable);
    }

    // Test con un solo documento
    @Test
    void testSearchDocuments_singleResult() {
        // Setup
        String keyword = "doc1";
        String type = "pdf";
        List<String> stakeholderNames = List.of("stakeholder1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("stakeholder1"));
        Document document = new Document(1L, "doc1", "description", stakeholders, type, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(keyword, type, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(keyword, type, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("doc1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(keyword, type, stakeholderNames, scale, pageable);
    }

    // Test con keyword vuoto e tipo vuoto
    @Test
    void testSearchDocuments_emptyKeywordAndType() {
        // Setup
        List<String> stakeholderNames = List.of("Stakeholder 1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("Stakeholder 1"));
        Document document = new Document(1L, "doc1", "description", stakeholders, null, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments("", "", stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments("", "", stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("doc1", result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments("", "", stakeholderNames, scale, pageable);
    }

    // Test con keyword lunga e tipo specifico
    @Test
    void testSearchDocuments_longKeyword() {
        // Setup
        String longKeyword = "a".repeat(1000); // Long keyword
        String type = "pdf";
        List<String> stakeholderNames = List.of("stakeholder1");
        String scale = "scale";
        List<Stakeholder> stakeholders = List.of(new Stakeholder("stakeholder1"));
        Document document = new Document(1L, longKeyword, "description", stakeholders, type, scale, LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);

        GeoReference geoReference = new GeoReference(document, null, null);
        document.setGeoReference(geoReference);

        List<Document> documents = List.of(document);
        Pageable pageable = PageRequest.of(0, 16);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, documents.size());
        when(documentRepository.searchDocuments(longKeyword, type, stakeholderNames, scale, pageable)).thenReturn(documentPage);

        // Execution
        List<DocumentBriefPageResponseDTO> result = documentService.searchDocuments(longKeyword, type, stakeholderNames, scale, 0);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(longKeyword, result.get(0).documentSnippets().get(0).title());
        verify(documentRepository, times(1)).searchDocuments(longKeyword, type, stakeholderNames, scale, pageable);
    }
}
