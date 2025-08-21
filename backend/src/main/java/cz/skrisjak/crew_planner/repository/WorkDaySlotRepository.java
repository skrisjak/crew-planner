package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.WorkDaySlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkDaySlotRepository extends JpaRepository<WorkDaySlot, Long> {
}
