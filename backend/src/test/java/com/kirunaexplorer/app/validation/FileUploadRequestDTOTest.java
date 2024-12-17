package com.kirunaexplorer.app.validation;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.exception.FileReadException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class FileUploadRequestDTOTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testToDocumentFilesValid() throws IOException {
        Document document = new Document();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("test.txt");
        when(mockFile.getSize()).thenReturn(10L);
        when(mockFile.getBytes()).thenReturn("content".getBytes());

        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of(mockFile));
        List<DocumentFile> documentFiles = requestDTO.toDocumentFiles(document);

        assertEquals(1, documentFiles.size());
        assertEquals("test", documentFiles.get(0).getName());
        assertEquals("txt", documentFiles.get(0).getExtension());
        assertEquals(10L, documentFiles.get(0).getSize());
        assertArrayEquals("content".getBytes(), documentFiles.get(0).getContent());
    }

    @Test
    void testToDocumentFilesIOException() throws IOException {
        Document document = new Document();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("test.txt");
        when(mockFile.getSize()).thenReturn(10L);
        when(mockFile.getBytes()).thenThrow(new IOException("Error reading file"));

        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of(mockFile));

        assertThrows(FileReadException.class, () -> requestDTO.toDocumentFiles(document));
    }

    @Test
    void testValidationValidFiles() {
        MultipartFile mockFile = mock(MultipartFile.class);
        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of(mockFile));

        Set<ConstraintViolation<FileUploadRequestDTO>> violations = validator.validate(requestDTO);

        assertTrue(violations.isEmpty());
    }

    @Test
    void testValidationNullFiles() {
        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(null);

        Set<ConstraintViolation<FileUploadRequestDTO>> violations = validator.validate(requestDTO);

        assertFalse(violations.isEmpty());
        assertEquals("non deve essere null", violations.iterator().next().getMessage());
    }

    /*@Test
    void testValidationEmptyFiles() {
        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of());

        Set<ConstraintViolation<FileUploadRequestDTO>> violations = validator.validate(requestDTO);

        // Assuming you have a validation constraint to prevent empty lists
        // If not, this test may need to be adjusted or removed
        assertFalse(violations.isEmpty());
    }*/

    @Test
    void testFileNameAndExtensionExtraction() throws IOException {
        Document document = new Document();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("example.file.txt");
        when(mockFile.getSize()).thenReturn(20L);
        when(mockFile.getBytes()).thenReturn("filecontent".getBytes());

        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of(mockFile));
        List<DocumentFile> documentFiles = requestDTO.toDocumentFiles(document);

        assertEquals("example.file", documentFiles.get(0).getName());
        assertEquals("txt", documentFiles.get(0).getExtension());
    }

    /*@Test
    void testFileNameAndExtensionExtractionNoExtension() throws IOException {
        Document document = new Document();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("examplefile");
        when(mockFile.getSize()).thenReturn(20L);
        when(mockFile.getBytes()).thenReturn("filecontent".getBytes());

        FileUploadRequestDTO requestDTO = new FileUploadRequestDTO(List.of(mockFile));
        List<DocumentFile> documentFiles = requestDTO.toDocumentFiles(document);

        assertEquals("examplefile", documentFiles.get(0).getName());
        assertEquals("", documentFiles.get(0).getExtension());
    }*/
}
