package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.AreaRequestDTO;
import com.kirunaexplorer.app.dto.response.AreaBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.AreaResponseDTO;
import com.kirunaexplorer.app.service.AreaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/areas")
public class AreaController {
    private final AreaService areaService;

    public AreaController(AreaService areaService) {
        this.areaService = areaService;
    }

    /**
     * Endpoint to get all areas
     *
     * @return List of AreaBriefResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<AreaBriefResponseDTO>> getAllAreas() {
        return ResponseEntity.ok(areaService.getAllAreas());
    }

    /**
     * Endpoint to get an area by id
     *
     * @param id Area id
     * @return AreaResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<AreaResponseDTO> getAreaById(@PathVariable Long id) {
        return ResponseEntity.ok(areaService.getAreaById(id));
    }


    /**
     * Endpoint to create an area
     *
     * @param area AreaRequestDTO
     * @return ResponseEntity<Void>
     */
    @PostMapping
    public ResponseEntity<Void> createArea(@RequestBody @Valid AreaRequestDTO area) {
        Long documentId = areaService.createArea(area);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(documentId)
            .toUri();
        return ResponseEntity.created(location).build();
    }
}
