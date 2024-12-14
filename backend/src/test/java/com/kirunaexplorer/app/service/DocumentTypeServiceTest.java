package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.repository.DocumentTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class DocumentTypeServiceTest {

    private DocumentTypeRepository documentTypeRepository;
    private DocumentTypeService documentTypeService;

    @BeforeEach
    void setUp() {
        documentTypeRepository = mock(DocumentTypeRepository.class);
        documentTypeService = new DocumentTypeService(documentTypeRepository);
    }

    @Test
    void testGetAllDocumentTypes_Empty() {
        when(documentTypeRepository.findAll()).thenReturn(Collections.emptyList());

        List<DocumentTypeResponseDTO> response = documentTypeService.getAllDocumentTypes();

        assertEquals(0, response.size());
        verify(documentTypeRepository, times(1)).findAll();
    }

    @Test
    void testGetAllDocumentTypes_SingleElement() {
        DocumentType type = new DocumentType(1L, "Type1");
        when(documentTypeRepository.findAll()).thenReturn(List.of(type));

        List<DocumentTypeResponseDTO> response = documentTypeService.getAllDocumentTypes();

        assertEquals(1, response.size());
        assertEquals("Type1", response.get(0).type_name());
        verify(documentTypeRepository, times(1)).findAll();
    }

    @Test
    void testCreateDocumentType_Success() {
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(null, "Type1");
        when(documentTypeRepository.existsByTypeName("Type1")).thenReturn(false);
        DocumentType savedType = new DocumentType(1L, "Type1");
        when(documentTypeRepository.save(any(DocumentType.class))).thenReturn(savedType);

        Long id = documentTypeService.createDocumentType(request);

        assertEquals(1L, id);
        verify(documentTypeRepository, times(1)).existsByTypeName("Type1");
        verify(documentTypeRepository, times(1)).save(any(DocumentType.class));
    }

    @Test
    void testCreateDocumentType_Duplicate() {
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(null, "Type1");
        when(documentTypeRepository.existsByTypeName("Type1")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> documentTypeService.createDocumentType(request));

        assertEquals("Document type already exists", exception.getMessage());
        verify(documentTypeRepository, times(1)).existsByTypeName("Type1");
        verify(documentTypeRepository, never()).save(any(DocumentType.class));
    }
}
