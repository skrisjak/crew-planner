package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ShiftPlan extends BasicEntity {
    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(name = "work_day_id")
    private WorkDay workDay;

    private String note;

    @Enumerated(EnumType.STRING)
    private Availability availability;
}
