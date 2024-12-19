package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Area;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    boolean existsAreaByName(@NotNull String name);

    @Query("SELECT a FROM Area a LEFT JOIN FETCH a.geometry g LEFT JOIN FETCH a.centroid c WHERE a.name = :name")
    Optional<Area> findAreaByName(@NotNull String name);
}
