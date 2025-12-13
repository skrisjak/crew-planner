package cz.skrisjak.crew_planner.shopping;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopCartItemRepository extends JpaRepository<ShopCartItem, Long> {
    Optional<ShopCartItem> findByItem(Item item);
}
