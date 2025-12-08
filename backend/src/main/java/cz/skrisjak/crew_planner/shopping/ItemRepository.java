package cz.skrisjak.crew_planner.shopping;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCategoryIsNull();
    Optional<Item> findByShopCartItem(ShopCartItem shopCartItem);
}
