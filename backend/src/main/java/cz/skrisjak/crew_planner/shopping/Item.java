package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Item extends BasicEntity {
    private String name;
    @Enumerated(EnumType.STRING)
    private MeasureUnit unit;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "shop_cart_item_id")
    private ShopCartItem shopCartItem;
    @ManyToOne
    private ItemCategory category;
    @Column(name="sort")
    private Long order;
}