package cz.skrisjak.crew_planner.model;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class WorkDayNote extends BasicEntity {
    private String label;

    private String description;
}