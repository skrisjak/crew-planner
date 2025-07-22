package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class WorkDayNote extends BasicEntity {
    private String label;
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "work_day_id", nullable = false)
    private WorkDay workDay;
}