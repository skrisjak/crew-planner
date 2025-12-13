package cz.skrisjak.crew_planner.shopping.data;


import lombok.Data;

@Data
public class PostShopCartItem {
    private Long id;
    private Long itemId;
    private Double quantity;
}