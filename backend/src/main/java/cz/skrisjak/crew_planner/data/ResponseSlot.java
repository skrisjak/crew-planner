package cz.skrisjak.crew_planner.data;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ResponseSlot {
    private Long id;
    private String slotName;
    private String registeredWorkerName;
    private String registeredWorkerImage;
    private LocalDate date;
}
