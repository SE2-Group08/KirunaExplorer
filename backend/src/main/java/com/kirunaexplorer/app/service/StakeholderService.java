package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import com.kirunaexplorer.app.model.Stakeholder;
import com.kirunaexplorer.app.repository.StakeholderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StakeholderService {
    private final StakeholderRepository stakeholderRepository;


    public StakeholderService(StakeholderRepository stakeholderRepository) {
        this.stakeholderRepository = stakeholderRepository;
    }

    /***
     * Get all stakeholders
     * @return List of stakeholders
     */
    public List<StakeholderResponseDTO> getAllStakeholders() {
        return stakeholderRepository.findAll().stream()
            .map(Stakeholder::toResponseDTO)
            .toList();
    }

    /***
     * Create a document
     * @param stakeholderRequest StakeholderRequestDTO
     * @return Long
     */
    @Transactional
    public Long createStakeholder(StakeholderRequestDTO stakeholderRequest) {
        Stakeholder stakeholder = stakeholderRequest.toStakeholder();
        stakeholder = stakeholderRepository.save(stakeholder);


        return stakeholder.getId();
    }
}

