package cz.skrisjak.crew_planner.data;

import lombok.Data;
import org.aspectj.weaver.patterns.ConcreteCflowPointcut;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkDayPlan {
    Long id;
    LocalDate date;
    List<ResponseNote> notes;
    List<ResponseSlot> slots;
    List<ResponseShiftPlan> registeredWorkers;
}
