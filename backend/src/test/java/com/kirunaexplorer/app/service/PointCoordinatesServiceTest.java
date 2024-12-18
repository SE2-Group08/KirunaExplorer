package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.inout.CoordinatesDTO;
import com.kirunaexplorer.app.dto.inout.PointCoordinatesDTO;
import com.kirunaexplorer.app.dto.request.PointCoordinatesRequestDTO;
import com.kirunaexplorer.app.dto.response.PointCoordinatesResponseDTO;
import com.kirunaexplorer.app.exception.DuplicatePointException;
import com.kirunaexplorer.app.model.PointCoordinates;
import com.kirunaexplorer.app.repository.PointCoordinatesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class PointCoordinatesServiceTest {

    private PointCoordinatesService pointCoordinatesService;
    private PointCoordinatesRepository pointCoordinatesRepository;

    @BeforeEach
    void setUp() {
        pointCoordinatesRepository = Mockito.mock(PointCoordinatesRepository.class);
        pointCoordinatesService = new PointCoordinatesService(pointCoordinatesRepository);
    }

    @Test
    void testGetAllPoints() {
        PointCoordinates point = new PointCoordinates(1L, "Test Point", 1.0, 1.0);
        when(pointCoordinatesRepository.findAllByNameNotNull()).thenReturn(List.of(point));

        List<PointCoordinatesResponseDTO> points = pointCoordinatesService.getAllPoints();
        assertEquals(1, points.size());

    }

    @Test
    void testCreatePoint() {
        PointCoordinatesRequestDTO requestDTO = new PointCoordinatesRequestDTO(new PointCoordinatesDTO(null, "Test Point", 1.0, 1.0));
        when(pointCoordinatesRepository.existsPointCoordinatesByNameAndNameIsNotNull(anyString())).thenReturn(false);
        when(pointCoordinatesRepository.save(any(PointCoordinates.class))).thenReturn(new PointCoordinates(1L, "Test Point", 1.0, 1.0));

        Long id = pointCoordinatesService.createPoint(requestDTO);
        assertEquals(1L, id);
    }

    @Test
    void testCreatePoint_DuplicateException() {
        PointCoordinatesRequestDTO requestDTO = new PointCoordinatesRequestDTO(new PointCoordinatesDTO(null, "Test Point", 1.0, 1.0));
        when(pointCoordinatesRepository.existsPointCoordinatesByNameAndNameIsNotNull(anyString())).thenReturn(true);

        assertThrows(DuplicatePointException.class, () -> pointCoordinatesService.createPoint(requestDTO));
    }
}
