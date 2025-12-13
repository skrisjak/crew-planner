package cz.skrisjak.crew_planner.shopping.data;

import lombok.Data;

import java.util.List;

@Data
public class ShoppingOrder {
    private String note;
    private List<PostShopCartItem> items;
}
