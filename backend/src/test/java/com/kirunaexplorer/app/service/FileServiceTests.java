package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.dto.response.FileSnippetResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.FileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileServiceTests {

    private FileRepository fileRepository;
    private DocumentRepository documentRepository;
    private FileService fileService;

    @BeforeEach
    void setUp() {
        fileRepository = mock(FileRepository.class);
        documentRepository = mock(DocumentRepository.class);
        fileService = new FileService(fileRepository, documentRepository);
    }

    @Test
    void testStoreFiles_Success() throws IOException {
        // Arrange
        Long documentId = 1L;
        Document mockDocument = mock(Document.class);
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(mockDocument));

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("test.txt");
        when(file.getSize()).thenReturn(100L);
        when(file.getBytes()).thenReturn("Content".getBytes());

        FileUploadRequestDTO request = new FileUploadRequestDTO(List.of(file));
        DocumentFile mockFile = new DocumentFile(1L, mockDocument, "test", "txt", 100L, "Content".getBytes());
        when(fileRepository.saveAll(anyList())).thenReturn(List.of(mockFile));

        // Act
        Long fileId = fileService.storeFiles(documentId, request);

        // Assert
        assertNotNull(fileId);
        assertEquals(1L, fileId);
        verify(documentRepository, times(1)).findById(documentId);
        verify(fileRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testStoreFiles_DocumentNotFound() {
        // Arrange
        Long documentId = 1L;
        when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

        FileUploadRequestDTO request = new FileUploadRequestDTO(List.of());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> fileService.storeFiles(documentId, request));
        verify(documentRepository, times(1)).findById(documentId);
        verify(fileRepository, never()).saveAll(anyList());
    }

    @Test
    void testGetFile_Success() {
        // Arrange
        Long fileId = 1L;
        DocumentFile mockFile = new DocumentFile(fileId, null, "test", "txt", 100L, "Content".getBytes());
        when(fileRepository.findById(fileId)).thenReturn(Optional.of(mockFile));

        // Act
        byte[] content = fileService.getFile(fileId);

        // Assert
        assertNotNull(content);
        assertArrayEquals("Content".getBytes(), content);
        verify(fileRepository, times(1)).findById(fileId);
    }

    @Test
    void testGetFile_FileNotFound() {
        // Arrange
        Long fileId = 1L;
        when(fileRepository.findById(fileId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> fileService.getFile(fileId));
        verify(fileRepository, times(1)).findById(fileId);
    }

    @Test
    void testDeleteFile_Success() {
        // Arrange
        Long fileId = 1L;
        Document mockDocument = mock(Document.class);
        DocumentFile mockFile = new DocumentFile(fileId, mockDocument, "test", "txt", 100L, "Content".getBytes());
        when(fileRepository.findById(fileId)).thenReturn(Optional.of(mockFile));

        // Act
        fileService.deleteFile(fileId);

        // Assert
        verify(mockDocument, times(1)).removeFile(mockFile);
        verify(documentRepository, times(1)).save(mockDocument);
        verify(fileRepository, times(1)).delete(mockFile);
    }

    @Test
    void testDeleteFile_FileNotFound() {
        // Arrange
        Long fileId = 1L;
        when(fileRepository.findById(fileId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> fileService.deleteFile(fileId));
        verify(fileRepository, times(1)).findById(fileId);
        verify(documentRepository, never()).save(any());
    }

    @Test
    void testGetFilesSnippet_DocumentNotFound() {
        // Arrange
        Long documentId = 1L;
        when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> fileService.getFilesSnippet(documentId));
        verify(documentRepository, times(1)).findById(documentId);
    }

    @Test
    void testGetFilesSnippet_Success() {
        // Arrange
        Long documentId = 1L;

        // Crea un mock di Document
        Document mockDocument = mock(Document.class);

        // Crea mock di DocumentFile
        DocumentFile file1 = mock(DocumentFile.class);
        DocumentFile file2 = mock(DocumentFile.class);

        Set<DocumentFile> files = Set.of(file1, file2);

        // Configura i mock
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(mockDocument));
        when(mockDocument.getDocumentFiles()).thenReturn(files);

        // Mock dei metodi su DocumentFile
        when(file1.toFileSnippetResponseDTO()).thenReturn(new FileSnippetResponseDTO(1L, "test1", "txt", 100L));
        when(file2.toFileSnippetResponseDTO()).thenReturn(new FileSnippetResponseDTO(2L, "test2", "pdf", 200L));

        // Act
        List<FileSnippetResponseDTO> result = fileService.getFilesSnippet(documentId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("test1", result.get(0).name());
        assertEquals("test2", result.get(1).name());
        verify(documentRepository, times(1)).findById(documentId);
        verify(mockDocument, times(1)).getDocumentFiles();
    }


}
