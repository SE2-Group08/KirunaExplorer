package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.DocumentScaleRequestDTO;
import com.kirunaexplorer.app.dto.request.DocumentTypeRequestDTO;
import com.kirunaexplorer.app.dto.request.LinkDocumentsRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import com.kirunaexplorer.app.dto.response.LinkDocumentsResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentLink;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.repository.DocumentLinkRepository;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.DocumentScaleRepository;
import com.kirunaexplorer.app.repository.DocumentTypeRepository;
import com.kirunaexplorer.app.service.DocumentLinkService;
import com.kirunaexplorer.app.service.DocumentScaleService;
import com.kirunaexplorer.app.service.DocumentTypeService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class StakeholderScaleTypeTests {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DocumentLinkRepository documentLinkRepository;

    @Mock
    private DocumentTypeRepository documentTypeRepository;

    @Mock
    private DocumentScaleRepository documentScaleRepository;

    @InjectMocks
    private DocumentLinkService documentLinkService;

    @InjectMocks
    private DocumentTypeService documentTypeService;

    @InjectMocks
    private DocumentScaleService documentScaleService;

    // DocumentLinkService Tests
    @Test
    void shouldLinkDocumentsSuccessfully() {
        Long docId = 1L;
        Long linkedDocId = 2L;
        String linkType = "RELATED";

        Document doc = new Document(docId, "Document 1");
        Document linkedDoc = new Document(linkedDocId, "Document 2");
        LinkDocumentsRequestDTO request = new LinkDocumentsRequestDTO(linkedDocId, linkType);

        Mockito.when(documentRepository.findById(docId)).thenReturn(Optional.of(doc));
        Mockito.when(documentRepository.findById(linkedDocId)).thenReturn(Optional.of(linkedDoc));
        Mockito.when(documentLinkRepository.existsByDocumentAndLinkedDocumentAndType(doc, linkedDoc, linkType))
                .thenReturn(false);

        DocumentLink newLink = new DocumentLink(1L, doc, linkedDoc, linkType, LocalDateTime.now());
        Mockito.when(documentLinkRepository.save(Mockito.any())).thenReturn(newLink);

        LinkDocumentsResponseDTO response = documentLinkService.linkDocuments(docId, request);

        Assertions.assertEquals(1L, response.id());
        Mockito.verify(documentLinkRepository).save(Mockito.any());
    }

    @Test
    void shouldThrowExceptionWhenLinkingToSelf() {
        Long docId = 1L;
        String linkType = "RELATED";

        Document doc = new Document(docId, "Document 1");
        LinkDocumentsRequestDTO request = new LinkDocumentsRequestDTO(docId, linkType);

        Mockito.when(documentRepository.findById(docId)).thenReturn(Optional.of(doc));

        Assertions.assertThrows(IllegalArgumentException.class,
                () -> documentLinkService.linkDocuments(docId, request));
    }

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
        Assertions.assertEquals("Type A", result.get(0).name());
        Assertions.assertEquals("Type B", result.get(1).name());
    }

    @Test
    void shouldThrowExceptionWhenTypeAlreadyExists() {
        String typeName = "Type A";
        DocumentTypeRequestDTO request = new DocumentTypeRequestDTO(typeName);

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
        Assertions.assertEquals("Scale 1", result.get(0).name());
        Assertions.assertEquals("Scale 2", result.get(1).name());
    }

    @Test
    void shouldCreateDocumentScaleSuccessfully() {
        DocumentScaleRequestDTO request = new DocumentScaleRequestDTO("Scale 1");
        DocumentScale scale = new DocumentScale(1L, "Scale 1");

        Mockito.when(documentScaleRepository.save(Mockito.any())).thenReturn(scale);

        Long scaleId = documentScaleService.createDocumentScale(request);

        Assertions.assertEquals(1L, scaleId);
        Mockito.verify(documentScaleRepository).save(Mockito.any());
    }
}
