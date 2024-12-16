package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.PointCoordinatesRequestDTO;
import com.kirunaexplorer.app.dto.response.PointCoordinatesResponseDTO;
import com.kirunaexplorer.app.model.PointCoordinates;
import com.kirunaexplorer.app.repository.PointCoordinatesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PointCoordinatesService {
    private final PointCoordinatesRepository pointCoordinatesRepository;

    public PointCoordinatesService(PointCoordinatesRepository pointCoordinatesRepository) {
        this.pointCoordinatesRepository = pointCoordinatesRepository;
    }

    /**
     * Get all points.
     *
     * @return list of all points
     */
    public List<PointCoordinatesResponseDTO> getAllPoints() {
        return pointCoordinatesRepository.findAll().stream()
            .map(PointCoordinates::fromPointCoordinates)
            .toList();
    }

    public Long createPoint(PointCoordinatesRequestDTO pointCoordinatesRequestDTO) {

        // Check if point already exists
        if (pointCoordinatesRepository.existsPointCoordinatesByName(pointCoordinatesRequestDTO.pointName())) {
            throw new IllegalArgumentException("Point already exists with same name");
        }

        // Save point
        PointCoordinates point = pointCoordinatesRequestDTO.toPointCoordinates();
        point = pointCoordinatesRepository.save(point);

        return point.getId();
    }
}
