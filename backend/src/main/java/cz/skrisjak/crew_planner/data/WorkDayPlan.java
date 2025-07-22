package cz.skrisjak.crew_planner.data;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class WorkDayPlan {
    Long id;
    LocalDate date;
    List<ResponseNote> notes;
    List<ResponseShiftPlan> registeredWorkers;
}
