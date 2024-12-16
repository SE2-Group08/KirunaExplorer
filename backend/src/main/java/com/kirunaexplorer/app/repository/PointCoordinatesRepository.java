package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.PointCoordinates;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointCoordinatesRepository extends JpaRepository<PointCoordinates, Long> {
    boolean existsPointCoordinatesByName(@NotNull String name);
}
