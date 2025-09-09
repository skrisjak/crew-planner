package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.subscription.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, String> {

}
