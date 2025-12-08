package cz.skrisjak.crew_planner.subscription;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Keys {
    private String p256dh;
    private String auth;
}
