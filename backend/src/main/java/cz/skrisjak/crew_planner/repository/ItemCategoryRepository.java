package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Long> {
}
