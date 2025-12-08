package cz.skrisjak.crew_planner.shopping.data;

import cz.skrisjak.crew_planner.shopping.Item;
import cz.skrisjak.crew_planner.shopping.ItemCategory;

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
        responseItem.setUnit(item.getUnit());
        if (item.getCategory() != null) {
            responseItem.setCategory(map(item.getCategory()));
        }
        responseItem.setOrder(item.getOrder());
        responseItem.setId(item.getId());
        if (item.getShopCartItem() != null) {
            responseItem.setQuantity(item.getShopCartItem().getQuantity());
        }
        return responseItem;
    }
}