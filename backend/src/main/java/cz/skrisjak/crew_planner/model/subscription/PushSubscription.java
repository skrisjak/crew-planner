package cz.skrisjak.crew_planner.model.subscription;

import cz.skrisjak.crew_planner.model.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PushSubscription {
    @Id
    private String endpoint;
    private Long expirationTime;
    @Embedded
    private Keys keys;
    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;
}