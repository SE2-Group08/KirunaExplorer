package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.repository.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentServicePaginationTest {

    private final DocumentRepository documentRepository = mock(DocumentRepository.class);
    private final DocumentService documentService = new DocumentService(documentRepository, null, null);

    @Test
    void testGetDocumentsByPageNumber_PageZero() {
        // Arrange
        int pageNo = 0;
        int pageSize = 16;
        List<Document> documents = generateDocuments(16); // Generate 16 mock documents
        Page<Document> page = new PageImpl<>(documents, PageRequest.of(pageNo, pageSize), 32);

        when(documentRepository.findAll(PageRequest.of(pageNo, pageSize))).thenReturn(page);

        // Act
        DocumentBriefPageResponseDTO result = documentService.getDocumentsByPageNumber(pageNo).get(0);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.totalPages());
        assertEquals(0, result.currentPage());
        assertEquals(16, result.totalItems());
        assertEquals(16, result.documentSnippets().size());
        result.documentSnippets().forEach(doc -> assertNotNull(doc.title())); // Validate content
        verify(documentRepository, times(1)).findAll(PageRequest.of(pageNo, pageSize));
    }

    @Test
    void testGetDocumentsByPageNumber_PageBeyondMax() {
        // Arrange
        int pageNo = 10; // Page number beyond the max
        int pageSize = 16;
        Page<Document> emptyPage = new PageImpl<>(new ArrayList<>(), PageRequest.of(pageNo, pageSize), 0);

        when(documentRepository.findAll(PageRequest.of(pageNo, pageSize))).thenReturn(emptyPage);

        // Act
        DocumentBriefPageResponseDTO result = documentService.getDocumentsByPageNumber(pageNo).get(0);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.totalPages());
        assertEquals(10, result.currentPage());
        assertEquals(0, result.totalItems());
        assertTrue(result.documentSnippets().isEmpty());
        verify(documentRepository, times(1)).findAll(PageRequest.of(pageNo, pageSize));
    }

    @Test
    void testGetDocumentsByPageNumber_LastPartialPage() {
        // Arrange
        int pageNo = 1;
        int pageSize = 16;
        List<Document> documents = generateDocuments(10); // Generate 10 mock documents
        Page<Document> partialPage = new PageImpl<>(documents, PageRequest.of(pageNo, pageSize), 26);

        when(documentRepository.findAll(PageRequest.of(pageNo, pageSize))).thenReturn(partialPage);

        // Act
        DocumentBriefPageResponseDTO result = documentService.getDocumentsByPageNumber(pageNo).get(0);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.totalPages());
        assertEquals(1, result.currentPage());
        assertEquals(10, result.totalItems());
        assertEquals(10, result.documentSnippets().size());
        result.documentSnippets().forEach(doc -> assertTrue(doc.title().startsWith("Document")));
        verify(documentRepository, times(1)).findAll(PageRequest.of(pageNo, pageSize));
    }

    @Test
    void testGetDocumentsByPageNumber_EmptyPage() {
        // Arrange
        int pageNo = 0;
        int pageSize = 16;
        Page<Document> emptyPage = new PageImpl<>(new ArrayList<>(), PageRequest.of(pageNo, pageSize), 0);

        when(documentRepository.findAll(PageRequest.of(pageNo, pageSize))).thenReturn(emptyPage);

        // Act
        DocumentBriefPageResponseDTO result = documentService.getDocumentsByPageNumber(pageNo).get(0);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.totalPages());
        assertEquals(0, result.currentPage());
        assertEquals(0, result.totalItems());
        assertTrue(result.documentSnippets().isEmpty());
        verify(documentRepository, times(1)).findAll(PageRequest.of(pageNo, pageSize));
    }

    @Test
    void testGetDocumentsByPageNumber_NegativePageNumber() {
        // Arrange
        int pageNo = -1;
        int pageSize = 16;

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            documentService.getDocumentsByPageNumber(pageNo);
        });
    }

    @Test
    void testGetDocumentsByPageNumber_InvalidPageSize() {
        // Arrange
        int pageNo = 0;
        int pageSize = -5; // Invalid page size

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            PageRequest.of(pageNo, pageSize);
        });
    }

    @Test
    void testGetDocumentsByPageNumber_OneDocument() {
        // Arrange
        int pageNo = 0;
        int pageSize = 16;
        List<Document> documents = generateDocuments(1); // Only one document
        Page<Document> page = new PageImpl<>(documents, PageRequest.of(pageNo, pageSize), 1);

        when(documentRepository.findAll(PageRequest.of(pageNo, pageSize))).thenReturn(page);

        // Act
        DocumentBriefPageResponseDTO result = documentService.getDocumentsByPageNumber(pageNo).get(0);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.totalPages());
        assertEquals(0, result.currentPage());
        assertEquals(1, result.totalItems());
        assertEquals(1, result.documentSnippets().size());
        verify(documentRepository, times(1)).findAll(PageRequest.of(pageNo, pageSize));
    }

    private List<Document> generateDocuments(int count) {
        List<Document> documents = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            Document document = mock(Document.class);
            when(document.toDocumentBriefResponseDTO()).thenReturn(
                    new DocumentBriefResponseDTO((long) i, "Document " + i, null, null, null,null, null)
            );
            documents.add(document);
        }
        return documents;
    }
}
