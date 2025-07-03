package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.ShiftEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftEntryRepository extends JpaRepository<ShiftEntry, Long> {
}
