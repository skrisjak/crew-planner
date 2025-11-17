package cz.skrisjak.crew_planner.mapper;

import cz.skrisjak.crew_planner.data.ResponseCategory;
import cz.skrisjak.crew_planner.data.ResponseItem;
import cz.skrisjak.crew_planner.model.Item;
import cz.skrisjak.crew_planner.model.ItemCategory;

public class ShoppingMapper {

    public static ResponseCategory map(ItemCategory category) {
        ResponseCategory responseCategory = new ResponseCategory();
        responseCategory.setName(category.getName());
        responseCategory.setId(category.getId());
        responseCategory.setOrder(category.getOrder());
        return responseCategory;
    }

    public static ResponseItem map(Item item) {
        ResponseItem responseItem = new ResponseItem();
        responseItem.setName(item.getName());
        responseItem.setQuantity(item.getQuantity());
        responseItem.setUnit(item.getUnit());
        if (item.getCategory() != null) {
            responseItem.setCategory(map(item.getCategory()));
        }
        responseItem.setOrder(item.getOrder());
        responseItem.setId(item.getId());
        return responseItem;
    }
}
