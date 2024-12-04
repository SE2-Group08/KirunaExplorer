package com.kiruna.explorer.app.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.GeoReference;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.service.DocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

class DocumentServiceTest {

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
        Document document = new Document(1L, "example1", "description", "stakeholder1", type, "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments(keyword, type)).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments(keyword, type);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments(keyword, type);
    }

    // Test senza keyword e tipo (entrambi null)
    @Test
    void testSearchDocuments_withNoKeywordAndType() {
        // Setup
        Document document = new Document(1L, "doc1", "description", "stakeholder1", "pdf", "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments(null, null)).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments(null, null);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("doc1", result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments(null, null);
    }

    // Test con keyword specificato ma tipo null
    @Test
    void testSearchDocuments_withKeywordAndNullType() {
        // Setup
        String keyword = "example";
        Document document = new Document(1L, "example1", "description", "stakeholder1", "pdf", "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments(keyword, null)).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments(keyword, null);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments(keyword, null);
    }

    // Test con tipo specificato ma keyword null
    @Test
    void testSearchDocuments_withNullKeywordAndType() {
        // Setup
        String type = "pdf";
        Document document = new Document(1L, "example1", "description", "stakeholder1", type, "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments(null, type)).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments(null, type);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("example1", result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments(null, type);
    }

    // Test senza risultati
    @Test
    void testSearchDocuments_noResults() {
        // Setup
        when(documentRepository.searchDocuments("nonexistent", "txt")).thenReturn(Collections.emptyList());

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments("nonexistent", "txt");

        // Verification
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(documentRepository, times(1)).searchDocuments("nonexistent", "txt");
    }

    // Test con documenti nulli nel repository
    @Test
    void testSearchDocuments_repositoryReturnsNull() {
        // Setup
        when(documentRepository.searchDocuments("example", "pdf")).thenReturn(null);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments("example", "pdf");

        // Verification
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(documentRepository, times(1)).searchDocuments("example", "pdf");
    }

    // Test con un solo documento
    @Test
    void testSearchDocuments_singleResult() {
        // Setup
        Document document = new Document(1L, "doc1", "description", "stakeholder1", "pdf", "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Collections.singletonList(document);
        when(documentRepository.searchDocuments("doc1", "pdf")).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments("doc1", "pdf");

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("doc1", result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments("doc1", "pdf");
    }

    // Test con keyword vuoto e tipo vuoto
    @Test
    void testSearchDocuments_emptyKeywordAndType() {
        // Setup
        Document document = new Document(1L, "doc1", "description", "stakeholder1", "pdf", "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments("", "")).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments("", "");

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(documentRepository, times(1)).searchDocuments("", "");
    }

    // Test con keyword lunga e tipo specifico
    @Test
    void testSearchDocuments_longKeyword() {
        // Setup
        String longKeyword = "a".repeat(1000); // Keyword lunga
        String type = "pdf";
        Document document = new Document(1L, longKeyword, "description", "stakeholder1", type, "scale", LocalDate.now(), Document.DatePrecision.FULL_DATE, "en", 10, LocalDateTime.now(), LocalDateTime.now(), null, null, null);
        List<Document> documents = Arrays.asList(document);
        when(documentRepository.searchDocuments(longKeyword, type)).thenReturn(documents);

        // Execution
        List<DocumentBriefResponseDTO> result = documentService.searchDocuments(longKeyword, type);

        // Verification
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(longKeyword, result.get(0).title());
        verify(documentRepository, times(1)).searchDocuments(longKeyword, type);
    }
}
