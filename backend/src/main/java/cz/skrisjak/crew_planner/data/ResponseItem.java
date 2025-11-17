package cz.skrisjak.crew_planner.data;

import cz.skrisjak.crew_planner.model.MeasureUnit;
import lombok.Data;

@Data
public class ResponseItem {
    private Long id;
    private String name;
    private Double quantity;
    private MeasureUnit unit;
    private ResponseCategory category;
    private Long order;
}
