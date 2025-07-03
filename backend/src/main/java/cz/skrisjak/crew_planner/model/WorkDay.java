package cz.skrisjak.crew_planner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class WorkDay extends BasicEntity{

    private Date date;

    @OneToMany
    private List<WorkDayNote> notes;

    @OneToMany
    private List<ShiftPlan> registeredEmployees;
}
