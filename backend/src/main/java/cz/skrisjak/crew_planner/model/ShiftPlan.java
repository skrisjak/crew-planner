package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
public class ShiftPlan extends BasicEntity {
    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "work_day_id")
    private WorkDay workDay;

    private String note;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar")
    private Availability availability;
}
