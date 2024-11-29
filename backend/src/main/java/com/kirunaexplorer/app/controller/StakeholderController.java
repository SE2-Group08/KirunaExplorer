package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import com.kirunaexplorer.app.service.StakeholderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stakeholders")
public class StakeholderController {
    private final StakeholderService stakeholderService;

    public StakeholderController(StakeholderService stakeholderService) {
        this.stakeholderService = stakeholderService;
    }

    /**
     * Get all stakeholders
     *
     * @return List of stakeholders
     */
    @GetMapping
    public ResponseEntity<List<StakeholderResponseDTO>> getAllStakeholders() {
        return ResponseEntity.ok(stakeholderService.getAllStakeholders());
    }

    /**
     * Create a stakeholder
     *
     * @param stakeholder StakeholderRequestDTO
     * @return ResponseEntity
     */
    @PostMapping
    public ResponseEntity<Void> createStakeholder(@RequestBody @Valid StakeholderRequestDTO stakeholder) {
        Long documentId = stakeholderService.createStakeholder(stakeholder);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(documentId)
            .toUri();
        return ResponseEntity.created(location).build();
    }
}
