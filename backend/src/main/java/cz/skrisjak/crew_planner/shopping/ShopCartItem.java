package cz.skrisjak.crew_planner.shopping;

import cz.skrisjak.crew_planner.util.BasicEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class ShopCartItem extends BasicEntity {
    @OneToOne
    private Item item;
    private Double quantity;
    private String note;
}