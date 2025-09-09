package cz.skrisjak.crew_planner.data;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class Plan {
    private LocalDate startDate;
    private LocalDate endDate;
    private List<WorkDayPlan> workDays;
}