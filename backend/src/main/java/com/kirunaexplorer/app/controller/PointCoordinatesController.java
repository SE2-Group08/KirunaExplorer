package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.PointCoordinatesRequestDTO;
import com.kirunaexplorer.app.dto.response.PointCoordinatesResponseDTO;
import com.kirunaexplorer.app.service.PointCoordinatesService;
import com.kirunaexplorer.app.validation.groups.point_coordinates.PostPointCoordinates;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/points")
public class PointCoordinatesController {
    private final PointCoordinatesService pointCoordinatesService;

    public PointCoordinatesController(PointCoordinatesService pointCoordinatesService) {
        this.pointCoordinatesService = pointCoordinatesService;
    }

    /**
     * Endpoint to get all points
     *
     * @return List of PointCoordinatesResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<PointCoordinatesResponseDTO>> getAllPoints() {
        return ResponseEntity.ok(pointCoordinatesService.getAllPoints());
    }

    /**
     * Endpoint to create a point
     *
     * @param pointCoordinatesRequestDTO PointCoordinatesRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping
    public ResponseEntity<Void> createPoint(@RequestBody @Validated({PostPointCoordinates.class}) PointCoordinatesRequestDTO pointCoordinatesRequestDTO) {
        System.out.println(pointCoordinatesRequestDTO);
        Long pointId = pointCoordinatesService.createPoint(pointCoordinatesRequestDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(pointId)
            .toUri();
        return ResponseEntity.created(location).build();
    }
}
