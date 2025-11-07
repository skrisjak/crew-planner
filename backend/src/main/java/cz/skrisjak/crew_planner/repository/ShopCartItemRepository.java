package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.ShopCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopCartItemRepository extends JpaRepository<ShopCartItem, Long> {
}
