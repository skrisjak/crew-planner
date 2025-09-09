package cz.skrisjak.crew_planner.data;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class WorkDayPlan {
    private Long id;
    private LocalDate date;
    private List<ResponseNote> notes;
    private List<ResponseSlot> slots;
    private List<ResponseShiftPlan> registeredWorkers;
}