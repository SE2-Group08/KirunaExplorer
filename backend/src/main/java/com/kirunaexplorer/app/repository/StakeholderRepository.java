package com.kirunaexplorer.app.repository;

import com.kirunaexplorer.app.model.Stakeholder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StakeholderRepository extends JpaRepository<Stakeholder, Long> {
}
