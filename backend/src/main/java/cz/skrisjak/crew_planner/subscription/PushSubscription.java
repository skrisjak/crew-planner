package cz.skrisjak.crew_planner.subscription;

import cz.skrisjak.crew_planner.user.User;
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