package cz.skrisjak.crew_planner.shopping.data;

import cz.skrisjak.crew_planner.shopping.MeasureUnit;
import lombok.Data;

@Data
public class PostItem {
    private Long id;
    private String name;
    private MeasureUnit unit;
    private Double quantity;
    private Long categoryId;
    private Long order;
}