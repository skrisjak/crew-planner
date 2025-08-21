package cz.skrisjak.crew_planner.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class DefaultSlot extends BasicEntity {
    private String slotName;
    @OneToMany(mappedBy = "defaultSlot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkDaySlot> workDaySlots = new ArrayList<>();
}
