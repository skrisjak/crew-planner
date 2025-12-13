package cz.skrisjak.crew_planner.shopping.data;

import cz.skrisjak.crew_planner.shopping.MeasureUnit;
import lombok.Data;

@Data
public class ResponseItem {
    private Long id;
    private String name;
    private MeasureUnit unit;
    private ResponseCategory category;
    private Long order;
    private PostShopCartItem shopCartItem;
}