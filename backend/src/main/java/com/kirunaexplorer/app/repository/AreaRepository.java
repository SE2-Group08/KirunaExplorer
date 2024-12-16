package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Area;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    boolean existsAreaByName(@NotNull String name);
}
