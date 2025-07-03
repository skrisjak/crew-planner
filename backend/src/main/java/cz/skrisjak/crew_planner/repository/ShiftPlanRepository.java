package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.ShiftPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftPlanRepository extends JpaRepository<ShiftPlan, Long> {
}
