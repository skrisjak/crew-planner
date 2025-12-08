package cz.skrisjak.crew_planner.planning.data;

import cz.skrisjak.crew_planner.planning.Availability;
import cz.skrisjak.crew_planner.user.data.ResponseUser;
import lombok.Data;

@Data
public class ResponseShiftPlan {
    private Long id;
    private ResponseUser user;
    private String note;
    private Availability availability;
}