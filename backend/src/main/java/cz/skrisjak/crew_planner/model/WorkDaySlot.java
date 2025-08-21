package cz.skrisjak.crew_planner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class WorkDaySlot extends BasicEntity {

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;
    private String slotName;

    @ManyToOne
    @JoinColumn(name = "default_slot_id")
    private DefaultSlot defaultSlot;

    @ManyToOne
    private WorkDay workDay;
}
