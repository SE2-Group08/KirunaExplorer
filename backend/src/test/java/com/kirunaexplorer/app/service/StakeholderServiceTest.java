package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import com.kirunaexplorer.app.exception.DuplicateStakeholderException;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.StakeholderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class StakeholderServiceTest {

    @Mock
    private StakeholderRepository stakeholderRepository;

    @InjectMocks
    private StakeholderService stakeholderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllStakeholders() {
        Stakeholder stakeholder1 = new Stakeholder("Stakeholder 1");
        stakeholder1.setId(1L);
        Stakeholder stakeholder2 = new Stakeholder("Stakeholder 2");
        stakeholder2.setId(2L);
        List<Stakeholder> stakeholders = List.of(stakeholder1, stakeholder2);

        when(stakeholderRepository.findAll()).thenReturn(stakeholders);

        List<StakeholderResponseDTO> response = stakeholderService.getAllStakeholders();

        assertEquals(2, response.size());
        assertEquals("Stakeholder 1", response.get(0).name());
        assertEquals("Stakeholder 2", response.get(1).name());
    }

    @Test
    void testCreateStakeholder() {
        StakeholderRequestDTO requestDTO = new StakeholderRequestDTO(null, "New Stakeholder");
        Stakeholder stakeholder = new Stakeholder("New Stakeholder");
        Stakeholder savedStakeholder = new Stakeholder("New Stakeholder");
        savedStakeholder.setId(1L);

        when(stakeholderRepository.existsByName(requestDTO.name())).thenReturn(false);
        when(stakeholderRepository.save(any(Stakeholder.class))).thenReturn(savedStakeholder);

        Long id = stakeholderService.createStakeholder(requestDTO);

        assertEquals(1L, id);
        verify(stakeholderRepository).existsByName(requestDTO.name());
        verify(stakeholderRepository).save(any(Stakeholder.class));
    }

    @Test
    void testCreateDuplicateStakeholder() {
        StakeholderRequestDTO requestDTO = new StakeholderRequestDTO(null, "Duplicate Stakeholder");

        when(stakeholderRepository.existsByName(requestDTO.name())).thenReturn(true);

        assertThrows(DuplicateStakeholderException.class, () -> stakeholderService.createStakeholder(requestDTO));

        verify(stakeholderRepository).existsByName(requestDTO.name());
        verify(stakeholderRepository, never()).save(any(Stakeholder.class));
    }
}
