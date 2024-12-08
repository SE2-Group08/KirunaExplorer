package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.repository.DocumentScaleRepository;
import com.kirunaexplorer.app.repository.DocumentTypeRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class DocumentScaleTypeStakeholderTests {

    @Mock
    private DocumentTypeRepository documentTypeRepository;

    @Mock
    private DocumentScaleRepository documentScaleRepository;

    @InjectMocks
    private DocumentTypeService documentTypeService;

    @InjectMocks
    private DocumentScaleService documentScaleService;

    // DocumentTypeService Tests
    @Test
    void shouldReturnAllDocumentTypes() {
        List<DocumentType> types = List.of(
                new DocumentType(1L, "Type A"),
                new DocumentType(2L, "Type B")
        );

        Mockito.when(documentTypeRepository.findAll()).thenReturn(types);

        List<DocumentTypeResponseDTO> result = documentTypeService.getAllDocumentTypes();

        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Type A", result.get(0).type_name());
        Assertions.assertEquals("Type B", result.get(1).type_name());
    }

    @Test
    void shouldThrowExceptionWhenTypeAlreadyExists() {
        String typeName = "Type A";
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(1L, typeName);

        Mockito.when(documentTypeRepository.existsByTypeName(typeName)).thenReturn(true);

        Assertions.assertThrows(IllegalArgumentException.class,
                () -> documentTypeService.createDocumentType(request));
    }

    // DocumentScaleService Tests
    @Test
    void shouldReturnAllDocumentScales() {
        List<DocumentScale> scales = List.of(
                new DocumentScale(1L, "Scale 1"),
                new DocumentScale(2L, "Scale 2")
        );

        Mockito.when(documentScaleRepository.findAll()).thenReturn(scales);

        List<DocumentScaleResponseDTO> result = documentScaleService.getAllDocumentScales();

        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Scale 1", result.get(0).scale());
        Assertions.assertEquals("Scale 2", result.get(1).scale());
    }

    @Test
    void shouldCreateDocumentScaleSuccessfully() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO(1L, "Scale 1");
        DocumentScale scale = new DocumentScale(1L, "Scale 1");

        Mockito.when(documentScaleRepository.save(Mockito.any())).thenReturn(scale);

        Long scaleId = documentScaleService.createDocumentScale(request);

        Assertions.assertEquals(1L, scaleId);
        Mockito.verify(documentScaleRepository).save(Mockito.any());
    }
}
