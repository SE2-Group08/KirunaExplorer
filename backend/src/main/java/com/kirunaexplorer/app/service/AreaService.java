package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.AreaRequestDTO;
import com.kirunaexplorer.app.dto.response.AreaBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.AreaResponseDTO;
import com.kirunaexplorer.app.exception.DuplicateAreaException;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Area;
import com.kirunaexplorer.app.repository.AreaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaService {
    private final AreaRepository areaRepository;

    public AreaService(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }


    /**
     * Get all areas.
     *
     * @return list of all areas
     */
    public List<AreaBriefResponseDTO> getAllAreas() {
        return areaRepository.findAll().stream()
            .map(Area::toAreaBriefResponseDTO)
            .toList();
    }

    /**
     * Create an area.
     *
     * @param areaRequest AreaRequestDTO
     * @return id of the created area
     */
    public Long createArea(AreaRequestDTO areaRequest) {
        // Check if area already exists
        if (areaRepository.existsAreaByName(areaRequest.area().areaName())) {
            throw new DuplicateAreaException("Area already exists with same name");
        }

        // Save area
        Area area = areaRequest.toArea();
        area = areaRepository.save(area);

        return area.getId();
    }

    /**
     * Get an area by id.
     *
     * @param id Area id
     * @return AreaResponseDTO
     */
    public AreaResponseDTO getAreaById(Long id) {
        return areaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id))
            .toAreaResponseDTO();
    }
}
