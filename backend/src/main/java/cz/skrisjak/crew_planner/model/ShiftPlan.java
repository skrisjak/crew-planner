package cz.skrisjak.crew_planner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ShiftPlan extends BasicEntity {
    @ManyToOne
    private User user;

    @ManyToOne
    private WorkDay workDay;

    private String note;

    @Enumerated(EnumType.STRING)
    private Availability availability;
}
