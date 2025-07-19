package cz.skrisjak.crew_planner.data;

import cz.skrisjak.crew_planner.model.WorkDayNote;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkDayPlan {
    Long id;
    LocalDate date;
    List<WorkDayNote> notes;
    List<ResponseShiftPlan> registeredWorkers;
}
