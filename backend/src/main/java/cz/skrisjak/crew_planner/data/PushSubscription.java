package cz.skrisjak.crew_planner.data;

import lombok.Data;

@Data
public class PushSubscription {
    private String endpoint;
    private Long expirationTime;
    private Keys keys;
}