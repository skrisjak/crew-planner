package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.Column;
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
    @Column(name="sort")
    private Long order;
}
