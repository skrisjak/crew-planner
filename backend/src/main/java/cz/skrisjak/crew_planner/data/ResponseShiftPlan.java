package cz.skrisjak.crew_planner.data;

import cz.skrisjak.crew_planner.model.Availability;
import lombok.Data;

@Data
public class ResponseShiftPlan {
    private Long id;
    private ResponseUser user;
    private String note;
    private Availability availability;
}