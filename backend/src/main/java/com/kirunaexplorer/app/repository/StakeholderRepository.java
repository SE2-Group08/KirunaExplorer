package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Stakeholder;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StakeholderRepository extends JpaRepository<Stakeholder, Long> {
    Boolean existsByName(@NotNull @Size(min = 2, max = 64) String name);
}
