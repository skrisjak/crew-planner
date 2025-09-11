package cz.skrisjak.crew_planner.data;

import cz.skrisjak.crew_planner.model.subscription.PushSubscription;
import lombok.Data;

@Data
public class PushSubSend {
    private PushSubscription subscription;
    private String stringy;
}
