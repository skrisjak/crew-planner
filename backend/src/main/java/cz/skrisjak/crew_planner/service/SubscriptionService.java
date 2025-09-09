package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.model.Role;
import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.model.WorkDaySlot;
import cz.skrisjak.crew_planner.model.subscription.PushSubscription;
import cz.skrisjak.crew_planner.repository.PushSubscriptionRepository;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.function.Predicate;

@Service
public class SubscriptionService {

    private static Logger LOG = LoggerFactory.getLogger(SubscriptionService.class);

    @Value("${vapid.public}")
    private String publicKey;

    @Value("${vapid.private}")
    private String privateKey;

    private final PushSubscriptionRepository repository;
    private PushService pushService;

    @Autowired
    public SubscriptionService(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    public void subscribe(PushSubscription subscription, User user) {
        subscription.setUser(user);
        repository.save(subscription);
    }

    public void notifyShop() {
        sendNotification("Nový nákup", user -> user.getRole() != Role.EMPLOYEE);
    }

    public void notifyPlanChange(User author) {
        sendNotification("Změny v plánu", user -> !Objects.equals(user.getEmail(), author.getEmail()));
    }

    public void notifySlotChange(WorkDaySlot slot) {
        String slotName;

        if (slot.getSlotName() == null || (slot.getSlotName().isEmpty() && slot.getDefaultSlot() != null)) {
            slotName = slot.getDefaultSlot().getSlotName() + slot.getWorkDay().getDate().toString();
        } else {
            slotName = slot.getSlotName() + slot.getWorkDay().getDate().toString();
        }

        if (slot.getUser() != null) {
            sendNotification(slotName, user -> Objects.equals(user.getEmail(), slot.getUser().getEmail()));
        }

    }
    private <T> void sendNotification(T payload, Predicate<User> userFilter) {
        if (pushService != null) {
            List<PushSubscription> subscriptions = repository.findAll();
            for (PushSubscription subscription : subscriptions) {
                if (userFilter.test(subscription.getUser())) {
                    try {
                        pushService.send(new Notification(new Subscription(subscription.getEndpoint(), new Subscription.Keys(subscription.getKeys().getP256dh(), subscription.getKeys().getAuth())), payload.toString()));
                    } catch (GeneralSecurityException | IOException | ExecutionException | InterruptedException |
                             JoseException e) {
                        LOG.warn(e.getMessage());
                    }
                }
            }
        }
    }

    @PostConstruct
    private void init() {
        try {
            Security.addProvider(new BouncyCastleProvider());
            this.pushService = new PushService(publicKey, privateKey);
        } catch (Exception e) {
            LOG.warn("Could not initialize push service", e);
        }
    }
}
