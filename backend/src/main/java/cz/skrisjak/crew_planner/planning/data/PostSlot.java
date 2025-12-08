package cz.skrisjak.crew_planner.planning.data;

import lombok.Data;

@Data
public class PostSlot {
    private Long id;
    private String slotName;
    private String user;
    private Long workDayId;
}
