package cz.skrisjak.crew_planner.planning;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.Entity;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ShiftEntry extends BasicEntity {

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
