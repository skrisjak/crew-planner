package cz.skrisjak.crew_planner.data;

import lombok.Data;
import java.util.List;

@Data
public class ShoppingList {
    private List<ResponseCategory> categories;
    private List<ResponseItem> items;
}
