package cz.skrisjak.crew_planner.shopping.data;

import cz.skrisjak.crew_planner.planning.Availability;
import lombok.Data;

@Data
public class PostShiftPlan {
    private Long id;
    private String userEmail;
    private Long workDayId;
    private String note;
    private Availability availability;
}
