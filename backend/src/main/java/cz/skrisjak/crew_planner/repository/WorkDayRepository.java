package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.WorkDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkDayRepository extends JpaRepository<WorkDay, Long> {
}
