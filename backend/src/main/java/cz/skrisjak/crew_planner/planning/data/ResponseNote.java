package cz.skrisjak.crew_planner.planning.data;

import lombok.Data;

@Data
public class ResponseNote {
    private Long id;
    private Long workDayId;
    private String label;
    private String description;
}