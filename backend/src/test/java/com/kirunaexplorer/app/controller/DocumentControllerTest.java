package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.response.DocumentBriefPageResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.service.DocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentService documentService;

    @Autowired
    private DocumentController documentController;

    @Autowired
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Nested
    class GetDocumentsByPageNumberTests {

        private final List<DocumentBriefPageResponseDTO> documents = List.of(new DocumentBriefPageResponseDTO(
            1,
            0,
            2,
            List.of(new DocumentBriefResponseDTO(
                1L,
                "title",
                List.of("stakeholder"),
                "scale",
                "2023-01-01",
                "type",
                null
            ), new DocumentBriefResponseDTO(
                2L,
                "title",
                List.of("stakeholder"),
                "scale",
                "2023-01-01",
                "type",
                null
            ))
        ));


        /**
         * Test for successfully retrieving documents by page number.
         * This test verifies that when a valid page number is provided,
         * the response status is `200 OK` and the response body contains
         * the expected documents.
         *
         * @throws Exception if an error occurs during the request
         */
        @Test
        void testGetDocumentsByPageNumber_successful() throws Exception {
            int validPageNo = 0;

            when(documentService.getDocumentsByPageNumber(validPageNo)).thenReturn(documents);

            mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/documents")
                    .param("pageNo", String.valueOf(validPageNo)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].currentPage").value(validPageNo))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].totalItems").value(documents.get(0).documentSnippets().size()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].documentSnippets[0].id").value(documents.get(0).documentSnippets().get(0).id()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].documentSnippets[1].id").value(documents.get(0).documentSnippets().get(1).id()));
        }

        /**
         * Test for handling negative page number in the `getDocumentsByPageNumber` method.
         * This test verifies that when a negative page number is provided, the response status is `400 Bad Request`
         * and the error message matches the one defined in the `messages.properties` file.
         *
         * @throws Exception if an error occurs during the request
         */
        @Test
        void testGetDocumentsByPageNumber_negativePageNo() throws Exception {
            String errorMessage = messageSource.getMessage("error.pageNo.min", null, LocaleContextHolder.getLocale());

            int negativePageNo = -1;
            mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/documents")
                    .param("pageNo", String.valueOf(negativePageNo)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value(errorMessage));
        }

        /**
         * Test for handling non-integer page number in the `getDocumentsByPageNumber` method.
         * This test verifies that when a non-integer page number is provided, the response status is `400 Bad Request`.
         *
         * @throws Exception if an error occurs during the request
         */
        @Test
        void testGetDocumentsByPageNumber_nonIntegerAsPageNo() throws Exception {
            String nonIntegerPageNo = "abc";
            String errorMessage = messageSource.getMessage("error.pageNo.invalid", new Object[]{nonIntegerPageNo}, LocaleContextHolder.getLocale());

            mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/documents")
                    .param("pageNo", nonIntegerPageNo))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value(errorMessage));
        }

        /**
         * Test for handling the case when the page number is not provided in the `getDocumentsByPageNumber` method.
         * This test verifies that when the page number is not provided, the response status is `200 OK`
         * and the response body contains the expected documents for the default page number (0).
         *
         * @throws Exception if an error occurs during the request
         */
        @Test
        void testGetDocumentsByPageNumber_pageNoNotProvided() throws Exception {
            when(documentService.getDocumentsByPageNumber(0)).thenReturn(documents);

            mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/documents"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].totalItems").value(documents.get(0).documentSnippets().size()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].documentSnippets[0].id").value(documents.get(0).documentSnippets().get(0).id()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].documentSnippets[1].id").value(documents.get(0).documentSnippets().get(1).id()));
        }
    }

    @Nested
    class GetDocumentByIdTests {

        private final Long id = 1L;
        private final DocumentResponseDTO document = new DocumentResponseDTO(
            id.intValue(),
            "title",
            List.of("stakeholder"),
            "scale",
            "2023-01-01",
            "type",
            0,
            "English",
            10,
            null,
            "description"
        );

        @Test
        void testGetDocumentById_successful() {
            when(documentService.getDocumentById(id)).thenReturn(document);

            ResponseEntity<DocumentResponseDTO> response = documentController.getDocumentById(id);

            assertNotNull(response, "The response should not be null");
            assertEquals(HttpStatus.OK, response.getStatusCode(), "The status code should be OK - 200");
            assertEquals(document, response.getBody(), "The response body should match the document");
        }

        @Test
        void testGetDocumentById_notFound() {
            when(documentService.getDocumentById(id)).thenThrow(new ResourceNotFoundException("Document not found with ID " + id));

            ResponseEntity<DocumentResponseDTO> response;
            try {
                response = documentController.getDocumentById(id);
            } catch (ResourceNotFoundException e) {
                response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            assertNotNull(response, "The response should not be null");
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(), "The status code should be NOT_FOUND - 404");
        }
    }

    @Nested
    class GetAllDocumentsTests {

        private final List<DocumentBriefResponseDTO> documents = List.of(new DocumentBriefResponseDTO(
            1L,
            "title",
            List.of("stakeholder"),
            "scale",
            "2023-01-01",
            "type",
            null
        ));

        @Test
        void testGetAllDocuments_successful() {
            when(documentService.getAllDocuments()).thenReturn(documents);

            ResponseEntity<List<DocumentBriefResponseDTO>> response = documentController.getAllDocuments();

            assertNotNull(response, "The response should not be null");
            assertEquals(HttpStatus.OK, response.getStatusCode(), "The status code should be OK - 200");
            assertEquals(documents, response.getBody(), "The response body should match the documents");
        }
    }

    @Nested
    class CreateDocumentTests {

    }

    @Nested
    class UpdateDocumentTests {

    }

    @Nested
    class SearchDocumentsTests {

    }
}