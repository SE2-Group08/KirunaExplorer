package com.kirunaexplorer.app.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.kirunaexplorer.app.constants.GeometryType;
import com.kirunaexplorer.app.dto.inout.AreaBriefDTO;
import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.GeometryDTO;
import com.kirunaexplorer.app.dto.request.AreaRequestDTO;
import com.kirunaexplorer.app.dto.response.AreaBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.AreaResponseDTO;
import com.kirunaexplorer.app.exception.DuplicateAreaException;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Area;
import com.kirunaexplorer.app.model.Coordinates;
import com.kirunaexplorer.app.model.Geometry;
import com.kirunaexplorer.app.repository.AreaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AreaServiceTest {

    private AreaService areaService;
    private AreaRepository areaRepository;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        areaRepository = Mockito.mock(AreaRepository.class);
        areaService = new AreaService(areaRepository);
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testGetAllAreas() throws JsonProcessingException {
        List<Coordinates> listCoordinates = new ArrayList<>();
        String coordinatesString = objectMapper.writeValueAsString(listCoordinates); // Convert list to JSON string
        Area area = new Area(1L, "Test Area", new Coordinates(null, null), new Geometry(GeometryType.POLYGON, coordinatesString));

        when(areaRepository.findAll()).thenReturn(List.of(area));
        List<AreaBriefResponseDTO> areas = areaService.getAllAreas();
        assertEquals(1, areas.size());
        assertEquals("Test Area", areas.get(0).area().areaName());
    }

    @Test
    public void testCreateArea() {
        AreaRequestDTO areaRequest = createAreaRequestDTO();
        when(areaRepository.existsAreaByName(anyString())).thenReturn(false);
        when(areaRepository.save(any(Area.class))).thenReturn(new Area(1L, "Test Area", null, null));

        Long id = areaService.createArea(areaRequest);
        assertEquals(1L, id);
    }

    @Test
    public void testCreateArea_DuplicateException() {
        AreaRequestDTO areaRequest = createAreaRequestDTO();
        when(areaRepository.existsAreaByName(anyString())).thenReturn(true);

        assertThrows(DuplicateAreaException.class, () -> areaService.createArea(areaRequest));
    }

    @Test
    public void testGetAreaById() throws JsonProcessingException {
        List<Coordinates> listCoordinates = new ArrayList<>();
        String coordinatesString = objectMapper.writeValueAsString(listCoordinates); // Convert list to JSON string
        Area area = new Area(1L, "Test Area", new Coordinates(null, null), new Geometry(GeometryType.POLYGON, coordinatesString));
        when(areaRepository.findById(1L)).thenReturn(Optional.of(area));

        AreaResponseDTO response = areaService.getAreaById(1L);
        assertEquals(1L, response.id());
        assertEquals("Test Area", response.name());
    }

    @Test
    public void testGetAreaById_NotFoundException() {
        when(areaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> areaService.getAreaById(1L));
    }

    // Helper methods to create test objects
    private AreaRequestDTO createAreaRequestDTO() {
        AreaBriefDTO areaBriefDTO = new AreaBriefDTO(1L, "Test Area", new CoordinatesDTO(1.0, 1.0));
        ArrayNode coordinatesArray = objectMapper.createArrayNode();
        coordinatesArray.add(objectMapper.createObjectNode().put("latitude", 1.0).put("longitude", 1.0));
        coordinatesArray.add(objectMapper.createObjectNode().put("latitude", 2.0).put("longitude", 2.0));
        coordinatesArray.add(objectMapper.createObjectNode().put("latitude", 3.0).put("longitude", 3.0));
        GeometryDTO geometryDTO = new GeometryDTO("Polygon", coordinatesArray);
        return new AreaRequestDTO(areaBriefDTO, geometryDTO);
    }
}