package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class ShoppingList extends BasicEntity {
    @Column(columnDefinition = "TEXT")
    private String note;
    @OneToMany(mappedBy = "shoppingList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShopCartItem> items = new ArrayList<>();

    public void addItem(ShopCartItem shopCartItem) {
        items.add(shopCartItem);
        shopCartItem.setShoppingList(this);
    }
}