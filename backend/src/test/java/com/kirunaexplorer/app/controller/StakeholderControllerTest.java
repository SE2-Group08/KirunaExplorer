package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import com.kirunaexplorer.app.service.StakeholderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class StakeholderControllerTest {

    @Mock
    private StakeholderService stakeholderService;

    @InjectMocks
    private StakeholderController stakeholderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        MockHttpServletRequest request = new MockHttpServletRequest();
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    void testGetAllStakeholders() {
        List<StakeholderResponseDTO> stakeholders = List.of(
                new StakeholderResponseDTO(1, "Stakeholder 1"),
                new StakeholderResponseDTO(2, "Stakeholder 2")
        );

        when(stakeholderService.getAllStakeholders()).thenReturn(stakeholders);

        ResponseEntity<List<StakeholderResponseDTO>> response = stakeholderController.getAllStakeholders();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(stakeholders, response.getBody());
        verify(stakeholderService).getAllStakeholders();
    }

    @Test
    void testCreateStakeholder() {
        StakeholderRequestDTO requestDTO = new StakeholderRequestDTO(null, "New Stakeholder");
        Long stakeholderId = 1L;

        when(stakeholderService.createStakeholder(requestDTO)).thenReturn(stakeholderId);

        // Genera l'URI atteso
        URI expectedLocation = URI.create("http://localhost/1");

        ResponseEntity<Void> response = stakeholderController.createStakeholder(requestDTO);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(expectedLocation, response.getHeaders().getLocation());
        verify(stakeholderService).createStakeholder(requestDTO);
    }

}
