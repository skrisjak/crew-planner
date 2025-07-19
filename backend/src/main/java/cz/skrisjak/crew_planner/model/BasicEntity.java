package cz.skrisjak.crew_planner.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class BasicEntity {
    @Id
    @GeneratedValue
    private Long id;
}
