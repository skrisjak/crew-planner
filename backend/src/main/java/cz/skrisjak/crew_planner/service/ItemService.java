package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.data.PostItem;
import cz.skrisjak.crew_planner.data.PostShopCartItem;
import cz.skrisjak.crew_planner.model.Item;
import cz.skrisjak.crew_planner.model.ItemCategory;
import cz.skrisjak.crew_planner.model.ShopCartItem;
import cz.skrisjak.crew_planner.repository.ItemCategoryRepository;
import cz.skrisjak.crew_planner.repository.ItemRepository;
import cz.skrisjak.crew_planner.repository.ShopCartItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final ShopCartItemRepository shopCartItemRepository;
    private final ItemCategoryRepository itemCategoryRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository, ShopCartItemRepository ShopCartItemRepository, ItemCategoryRepository itemCategoryRepository) {
        this.itemRepository = itemRepository;
        this.shopCartItemRepository = ShopCartItemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
    }

    public List<ItemCategory> getCategories() {
        return itemCategoryRepository.findAll();
    }

    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    public Item createItem(PostItem item) {
        Item newItem = new Item();
        newItem.setName(item.getName());
        if (item.getCategoryId() != null) {
            newItem.setCategory(itemCategoryRepository.findById(item.getCategoryId()).orElse(null));
        }
        newItem.setUnit(item.getUnit());
        newItem.setQuantity(item.getQuantity());
        return itemRepository.save(newItem);
    }

    public void updateItem(PostItem item) throws NoSuchElementException {
        Item update = itemRepository.findById(item.getId()).orElseThrow();
        update.setName(item.getName());
        if (item.getCategoryId() != null) {
            update.setCategory(itemCategoryRepository.findById(item.getCategoryId()).orElse(null));
        } else {
            update.setCategory(null);
        }
        update.setUnit(item.getUnit());
        update.setQuantity(item.getQuantity());
        itemRepository.save(update);
    }

    public void deleteItem(Long id) throws NoSuchElementException {
        Item delete = itemRepository.findById(id).orElseThrow();
        itemRepository.delete(delete);
    }

    public ItemCategory createItemCategory(ItemCategory category) {
        return itemCategoryRepository.save(category);
    }

    public void updateItemCategory(ItemCategory category) throws NoSuchElementException {
        ItemCategory update = itemCategoryRepository.findById(category.getId()).orElseThrow();
        update.setName(category.getName());
        itemCategoryRepository.save(update);
    }

    @Transactional
    public void deleteItemCategory(Long id) throws NoSuchElementException {
        ItemCategory category = itemCategoryRepository.findById(id).orElseThrow();
        category.getItems().forEach(item -> {
            item.setCategory(null);
            itemRepository.save(item);
        });
        itemCategoryRepository.delete(category);
    }

    @Transactional
    public void addShopCartItems(List<PostShopCartItem> items) {
        items.forEach(item -> {
            Optional<Item> updatedItem = itemRepository.findById(item.getItemId());
            if (updatedItem.isPresent()) {
                Item update = updatedItem.get();
                if (update.getShopCartItem() != null) {
                    shopCartItemRepository.delete(update.getShopCartItem());
                    update.setShopCartItem(null);
                }
                ShopCartItem shopCartItem = new ShopCartItem();
                shopCartItem.setQuantity(item.getQuantity());
                shopCartItem.setNote(item.getNote());
                shopCartItem.setItem(update);
                update.setShopCartItem(shopCartItem);
                shopCartItemRepository.save(shopCartItem);
            }
        });
    }

    public void deleteShopCartItem(Long id) throws NoSuchElementException {
        ShopCartItem delete = shopCartItemRepository.findById(id).orElseThrow();
        shopCartItemRepository.delete(delete);
    }

    @Transactional
    public void resolveShopCartItem(ShopCartItem item) {
        Item update = item.getItem();
        update.setQuantity(item.getQuantity() + update.getQuantity());
        shopCartItemRepository.delete(item);
        itemRepository.save(update);
    }

    public void resolveShopCartItem(Long id) throws NoSuchElementException {
        ShopCartItem item = shopCartItemRepository.findById(id).orElseThrow();
        resolveShopCartItem(item);
    }

    public void resolveShopCartItems() {
        List<ShopCartItem> items = shopCartItemRepository.findAll();
        items.forEach(this::resolveShopCartItem);
    }
}
