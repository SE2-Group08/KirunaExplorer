package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.dto.response.FileSnippetResponseDTO;
import com.kirunaexplorer.app.service.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class FileControllerTest {

    @Mock
    private FileService fileService;

    @InjectMocks
    private FileController fileController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        MockHttpServletRequest request = new MockHttpServletRequest();
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    void testUploadFile() {
        Long documentId = 1L;
        Long fileId = 2L;
        MultipartFile file = mock(MultipartFile.class);
        FileUploadRequestDTO fileUploadRequestDTO = new FileUploadRequestDTO(List.of(file));

        when(fileService.storeFiles(documentId, fileUploadRequestDTO)).thenReturn(fileId);

        ResponseEntity<Void> response = fileController.uploadFile(documentId, fileUploadRequestDTO);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(URI.create("/api/v1/files/2"), response.getHeaders().getLocation());
        verify(fileService).storeFiles(documentId, fileUploadRequestDTO);
    }

    @Test
    void testDownloadFile() {
        Long fileId = 1L;
        byte[] fileContent = "file content".getBytes();

        when(fileService.getFile(fileId)).thenReturn(fileContent);

        ResponseEntity<byte[]> response = fileController.downloadFile(fileId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(fileContent, response.getBody());
        verify(fileService).getFile(fileId);
    }

    @Test
    void testDeleteFile() {
        Long fileId = 1L;

        doNothing().when(fileService).deleteFile(fileId);

        ResponseEntity<Void> response = fileController.deleteFile(fileId);

        assertEquals(204, response.getStatusCodeValue());
        verify(fileService).deleteFile(fileId);
    }

    @Test
    void testGetFilesSnippet() {
        Long documentId = 1L;
        List<FileSnippetResponseDTO> snippetList = List.of(new FileSnippetResponseDTO(1L, "file1.txt", "pdf", 64L));

        when(fileService.getFilesSnippet(documentId)).thenReturn(snippetList);

        ResponseEntity<List<FileSnippetResponseDTO>> response = fileController.getFilesSnippet(documentId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(snippetList, response.getBody());
        verify(fileService).getFilesSnippet(documentId);
    }
}
