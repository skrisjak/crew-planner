package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.shopping.data.PostItem;
import cz.skrisjak.crew_planner.shopping.data.PostShopCartItem;
import cz.skrisjak.crew_planner.shopping.data.ShoppingOrder;
import cz.skrisjak.crew_planner.subscription.SubscriptionService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShoppingService {
    private final ItemRepository itemRepository;
    private final ShopCartItemRepository shopCartItemRepository;
    private final ItemCategoryRepository itemCategoryRepository;
    private final ShoppingListRepository shoppingListRepository;
    private final SubscriptionService subscriptionService;

    @Autowired
    public ShoppingService(ItemRepository itemRepository, ShopCartItemRepository ShopCartItemRepository, ItemCategoryRepository itemCategoryRepository, ShoppingListRepository shoppingListRepository, SubscriptionService subscriptionService) {
        this.itemRepository = itemRepository;
        this.shopCartItemRepository = ShopCartItemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
        this.shoppingListRepository = shoppingListRepository;
        this.subscriptionService = subscriptionService;
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
        return itemRepository.save(newItem);
    }

    @Transactional
    public void updateItem(PostItem item) throws NoSuchElementException {
        Item update = itemRepository.findById(item.getId()).orElseThrow();
        update.setName(item.getName());
        update.setUnit(item.getUnit());

        if (item.getCategoryId() != null) {
            update.setCategory(itemCategoryRepository.findById(item.getCategoryId()).orElse(null));
        } else {
            update.setCategory(null);
        }
        itemRepository.save(update);
        if (item.getOrder() != null && !item.getOrder().equals(update.getOrder())) {
            update.setOrder(item.getOrder());
            reorderItems(update, update.getCategory());
        }
    }

    @Transactional
    public void reorderItems(Item reorderedItem, ItemCategory category) {


        //sorted by order, otherwise default
        List<Item> items;
        if (category == null) {
            items = itemRepository.findByCategoryIsNull();
        } else {
            items = category.getItems();
        }
        items = items.stream().sorted((it1, it2) -> {
            if (it1.getOrder() != null && it2.getOrder() != null) {
                return it1.getOrder().compareTo(it2.getOrder());
            } else {
                return -1;
            }
        }).collect(Collectors.toList());

        long index= 0;
        for (Item item : items) {
            if (!item.equals(reorderedItem)) {

                if (index== reorderedItem.getOrder()) {
                    index++;
                }

                //if order null or greater than inserted, we update
                if (item.getOrder() == null || item.getOrder() >= reorderedItem.getOrder()) {
                    item.setOrder(index);
                    itemRepository.save(item);
                }
            }
            index++;
        }
    }

    public void deleteItem(Long id) throws NoSuchElementException {
        Item delete = itemRepository.findById(id).orElseThrow();
        itemRepository.delete(delete);
    }

    public ItemCategory createItemCategory(ItemCategory category) {
        return itemCategoryRepository.save(category);
    }

    @Transactional
    public void updateItemCategory(ItemCategory category) throws NoSuchElementException {
        ItemCategory update = itemCategoryRepository.findById(category.getId()).orElseThrow();
        update.setName(category.getName());
        if (category.getOrder() != null && !category.getOrder().equals(update.getOrder())) {
            update.setOrder(category.getOrder());
            reorderCategories(update);
        }
        itemCategoryRepository.save(update);
    }

    @Transactional
    public void reorderCategories(ItemCategory category) {
        List<ItemCategory> categories = new ArrayList<>(itemCategoryRepository.findAll().stream().sorted(
                (cat1, cat2) -> {
                    if (cat1.getOrder() !=null && cat2.getOrder() != null) {
                        return cat1.getOrder().compareTo(cat2.getOrder());
                    }
                    return 0;
                }
        ).collect(Collectors.toList()));

        long index = 0;
        for (ItemCategory cat : categories) {
            if (!cat.equals(category)) {
                if (index == category.getOrder()) {
                    index++;
                }

                if (cat.getOrder() == null || cat.getOrder() >= category.getOrder()) {
                    cat.setOrder(index);
                    itemCategoryRepository.save(cat);
                }
            }
            index++;
        }

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
    public ShoppingList addShopCartItems(ShoppingOrder shoppingOrder) {

        ShoppingList shoppingList = shoppingListRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    ShoppingList sl = new ShoppingList();
                    sl.setNote(shoppingOrder.getNote());
                    return shoppingListRepository.save(sl);
                });

        shoppingList.setNote(shoppingOrder.getNote());

        shoppingOrder.getItems().forEach(orderItem -> {

            Item item = itemRepository.findById(orderItem.getItemId())
                    .orElseThrow();

            ShopCartItem shopCartItem = item.getShopCartItem();

            if (shopCartItem == null) {
                shopCartItem = new ShopCartItem();
                shopCartItem.setItem(item);
                item.setShopCartItem(shopCartItem);
                shoppingList.addItem(shopCartItem);
                shopCartItem = shopCartItemRepository.save(shopCartItem);
            }

            shopCartItem.setQuantity(orderItem.getQuantity());
            shopCartItem.setItem(item);
        });

        subscriptionService.notifyShop(shoppingList);
        return shoppingList;
    }


    public void deleteShopCartItem(Long id) throws NoSuchElementException {
        ShopCartItem delete = shopCartItemRepository.findById(id).orElseThrow();
        shopCartItemRepository.delete(delete);
    }

    public String getShopNote() {
        List<ShoppingList> list = shoppingListRepository.findAll();
        if (list.isEmpty()) {
            return "";
        } else {
            return list.get(0).getNote();
        }
    }


    @Transactional
    public void resolveShopCartItem(Long id) throws NoSuchElementException {
        ShopCartItem item = shopCartItemRepository.findById(id).orElseThrow();
        itemRepository.findByShopCartItem(item).ifPresent(shopCartItem -> {
            shopCartItem.setShopCartItem(null);
        });
    }

    public void resolveShopCartItems() {
        itemRepository.findAll().forEach(item -> {
            item.setShopCartItem(null);
        });
        shopCartItemRepository.deleteAll();
        shoppingListRepository.deleteAll();
    }
}
