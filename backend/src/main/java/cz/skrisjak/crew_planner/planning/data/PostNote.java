package cz.skrisjak.crew_planner.planning.data;

import lombok.Data;

@Data
public class PostNote {
    private Long id;
    private Long workDayId;
    private String label;
    private String description;
}
