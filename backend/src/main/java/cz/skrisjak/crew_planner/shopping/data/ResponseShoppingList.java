package cz.skrisjak.crew_planner.shopping.data;

import lombok.Data;
import java.util.List;

@Data
public class ResponseShoppingList {
    private List<ResponseCategory> categories;
    private List<ResponseItem> items;
    private String note;
}
