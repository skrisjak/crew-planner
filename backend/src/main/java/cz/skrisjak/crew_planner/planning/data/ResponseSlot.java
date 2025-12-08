package cz.skrisjak.crew_planner.planning.data;

import cz.skrisjak.crew_planner.user.data.ResponseUser;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ResponseSlot {
    private Long id;
    private String slotName;
    private ResponseUser user;
    private LocalDate date;
}
