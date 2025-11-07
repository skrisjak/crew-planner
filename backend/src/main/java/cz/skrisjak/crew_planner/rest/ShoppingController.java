package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.data.*;
import cz.skrisjak.crew_planner.mapper.ShoppingMapper;
import cz.skrisjak.crew_planner.model.Item;
import cz.skrisjak.crew_planner.model.ItemCategory;
import cz.skrisjak.crew_planner.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shopping")
public class ShoppingController {

    private final ItemService itemService;

    @Autowired
    public ShoppingController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ShoppingList getItems() {
        ShoppingList list = new ShoppingList();
        list.setCategories(itemService.getCategories().stream().map(ShoppingMapper::map).collect(Collectors.toList()));
        list.setItems(itemService.getItems().stream().map(ShoppingMapper::map).collect(Collectors.toList()));
        return list;
    }

    @PostMapping("/item")
    public ResponseItem createItem(@RequestBody PostItem item) {
        return ShoppingMapper.map(itemService.createItem(item));
    }

    @PutMapping("/item")
    public ResponseEntity<Void> updateItem(@RequestBody PostItem item) {
        try {
             itemService.updateItem(item);
             return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/shoppingList")
    public ResponseEntity<Void> postShopping(@RequestBody List<PostShopCartItem> items) {
        itemService.addShopCartItems(items);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping("/shoppingList")
    public ResponseEntity<Void> resolveShoppingList() {
        itemService.resolveShopCartItems();
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping("/shoppingList/{id}")
    public ResponseEntity<Void> resolveShoppingItem(@PathVariable Long id) {
        try {
            itemService.resolveShopCartItem(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
    }

    @DeleteMapping("shoppingList/{id}")
    public ResponseEntity<Void> deleteShopping(@PathVariable Long id) {
        try {
            itemService.deleteShopCartItem(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/category")
    public ItemCategory createCategory(@RequestBody ItemCategory category) {
        return itemService.createItemCategory(category);
    }

    @PutMapping("/category")
    public ResponseEntity<Void> updateCategory(@RequestBody ItemCategory category) {
        try {
            itemService.updateItemCategory(category);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            itemService.deleteItemCategory(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}