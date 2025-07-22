package cz.skrisjak.crew_planner.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class WorkDay extends BasicEntity {

    private LocalDate date;

    @OneToMany(mappedBy = "workDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkDayNote> notes;

    @OneToMany(mappedBy = "workDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShiftPlan> registeredEmployees;
}