package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.WorkDayNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkDayNoteRepository extends JpaRepository<WorkDayNote, Long> {
}
