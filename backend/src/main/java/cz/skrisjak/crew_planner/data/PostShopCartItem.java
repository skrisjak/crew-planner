package cz.skrisjak.crew_planner.data;


import lombok.Data;

@Data
public class PostShopCartItem {
    private Long id;
    private Long itemId;
    private String note;
    private Double quantity;
}