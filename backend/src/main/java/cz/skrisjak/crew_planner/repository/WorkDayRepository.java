package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.WorkDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkDayRepository extends JpaRepository<WorkDay, Long> {
    List<WorkDay> findByDate(LocalDate date);
    List<WorkDay> findByDateBetween(LocalDate date1, LocalDate date2);
}
