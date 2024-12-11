package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.dto.response.FileSnippetResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.FileRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileServiceTests {

    @Mock
    private FileRepository fileRepository;

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private FileService fileService;

    @Test
    void shouldStoreFilesSuccessfully() {
        Long documentId = 1L;

        Document document = new Document();
        document.setId(documentId);

        FileUploadRequestDTO request = mock(FileUploadRequestDTO.class);
        DocumentFile file = new DocumentFile(null, document, "file1", "txt", 1024L, new byte[]{});
        when(request.toDocumentFiles(document)).thenReturn(List.of(file));

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
        when(fileRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        Long result = fileService.storeFiles(documentId, request);

        Assertions.assertEquals(file.getId(), result);
        verify(fileRepository).saveAll(anyList());
    }

    @Test
    void shouldThrowExceptionWhenDocumentNotFoundWhileStoringFile() {
        Long documentId = 1L;
        FileUploadRequestDTO request = mock(FileUploadRequestDTO.class);

        when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class,
            () -> fileService.storeFiles(documentId, request));

        verify(fileRepository, never()).saveAll(any());
    }

    @Test
    void shouldReturnFileContentSuccessfully() {
        Long fileId = 1L;
        byte[] content = new byte[]{1, 2, 3};

        DocumentFile file = new DocumentFile(fileId, null, "file1", "txt", 1024L, content);
        when(fileRepository.findById(fileId)).thenReturn(Optional.of(file));

        byte[] result = fileService.getFile(fileId);

        Assertions.assertArrayEquals(content, result);
        verify(fileRepository).findById(fileId);
    }

    @Test
    void shouldThrowExceptionWhenFileNotFound() {
        Long fileId = 1L;

        when(fileRepository.findById(fileId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class,
            () -> fileService.getFile(fileId));
    }

    /*@Test
    void shouldDeleteFileSuccessfully() {
        Long fileId = 1L;
        Document document = new Document();
        DocumentFile file = new DocumentFile(fileId, document, "file1", "txt", 1024L, new byte[]{});
        document.setDocumentFiles(Set.of(file));

        when(fileRepository.findById(fileId)).thenReturn(Optional.of(file));
        when(documentRepository.save(any())).thenReturn(document);

        fileService.deleteFile(fileId);

        verify(fileRepository).delete(file);
        verify(documentRepository).save(document);
        Assertions.assertTrue(document.getDocumentFiles().isEmpty());
    }*/

    @Test
    void shouldThrowExceptionWhenDeletingFileNotFound() {
        Long fileId = 1L;

        when(fileRepository.findById(fileId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class,
            () -> fileService.deleteFile(fileId));

        verify(fileRepository, never()).delete(any());
        verify(documentRepository, never()).save(any());
    }

    @Test
    void shouldReturnFilesSnippetSuccessfully() {
        Long documentId = 1L;
        Document document = new Document();
        DocumentFile file1 = new DocumentFile(1L, document, "file1", "txt", 1024L, new byte[]{});
        DocumentFile file2 = new DocumentFile(2L, document, "file2", "pdf", 2048L, new byte[]{});
        document.setDocumentFiles(Set.of(file1, file2));

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

        List<FileSnippetResponseDTO> result = fileService.getFilesSnippet(documentId);

        Assertions.assertEquals(2, result.size());
        /*Assertions.assertEquals("file1", result.get(0).name());
        Assertions.assertEquals("file2", result.get(1).name());*/
        verify(documentRepository).findById(documentId);
    }

    @Test
    void shouldThrowExceptionWhenDocumentNotFoundForSnippet() {
        Long documentId = 1L;

        when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class,
            () -> fileService.getFilesSnippet(documentId));

        verify(documentRepository).findById(documentId);
    }
}
