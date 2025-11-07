package cz.skrisjak.crew_planner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class ItemCategory extends BasicEntity {
    private String name;
    @OneToMany(mappedBy = "category")
    private List<Item> items;
}
