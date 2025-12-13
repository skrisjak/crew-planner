package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ShopCartItem extends BasicEntity {
    @OneToOne(mappedBy = "shopCartItem")
    private Item item;
    private Double quantity;

    @ManyToOne
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingList shoppingList;
}