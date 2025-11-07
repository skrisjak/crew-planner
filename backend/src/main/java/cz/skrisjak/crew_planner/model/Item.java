package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Item extends BasicEntity {
    private String name;
    private Double quantity;
    @Enumerated(EnumType.STRING)
    private MeasureUnit unit;
    @OneToOne
    private ShopCartItem shopCartItem;
    @ManyToOne
    private ItemCategory category;
}