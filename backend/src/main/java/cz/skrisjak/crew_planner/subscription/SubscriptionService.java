package cz.skrisjak.crew_planner.subscription;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.skrisjak.crew_planner.shopping.ShopCartItem;
import cz.skrisjak.crew_planner.shopping.ShoppingList;
import cz.skrisjak.crew_planner.user.Role;
import cz.skrisjak.crew_planner.user.User;
import cz.skrisjak.crew_planner.planning.WorkDaySlot;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
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
import java.time.format.DateTimeFormatter;
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

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd. MM.");

    private final PushSubscriptionRepository repository;
    private final ObjectMapper objectMapper;
    private PushService pushService;

    @Autowired
    public SubscriptionService(PushSubscriptionRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public void subscribe(PushSubscription subscription, User user) {
        subscription.setUser(user);
        if (subscription.getEndpoint() != null && !repository.existsById(subscription.getEndpoint())) {
            repository.save(subscription);
        }
    }

    public void notifyShop(ShoppingList list) {
        cz.skrisjak.crew_planner.subscription.Notification notification = new cz.skrisjak.crew_planner.subscription.Notification();
        notification.setTitle("Nový nákup");
        StringBuilder sb = new StringBuilder();
        for (ShopCartItem item : list.getItems()) {
            sb.append("- ").append(item.getItem().getName()).append(" ").append(item.getQuantity()).append(item.getItem().getUnit().unit).append("\n");
        }
        sb.append(list.getNote());
        notification.setBody(sb.toString());
        sendNotification(notification, user -> user.getRole() != Role.EMPLOYEE);
    }

    public void notifyPlanChange(User author) {
        cz.skrisjak.crew_planner.subscription.Notification notification = new cz.skrisjak.crew_planner.subscription.Notification();
        notification.setTitle("Nové směny");
        sendNotification(notification, user -> !Objects.equals(user.getEmail(), author.getEmail()));
    }

    public void notifySlotChange(WorkDaySlot slot) {
        cz.skrisjak.crew_planner.subscription.Notification notification = new cz.skrisjak.crew_planner.subscription.Notification();
        notification.setTitle("Byl(a) jste přidán do směny");

        if (slot.getSlotName() == null || (slot.getSlotName().isEmpty() && slot.getDefaultSlot() != null)) {
            notification.setBody(slot.getDefaultSlot().getSlotName() + " " + slot.getWorkDay().getDate().format(formatter));
        } else {
            notification.setBody(slot.getSlotName() + " " + slot.getWorkDay().getDate().format(formatter));
        }

        if (slot.getUser() != null) {
            sendNotification(notification, user -> Objects.equals(user.getEmail(), slot.getUser().getEmail()));
        }

    }
    private <T> void sendNotification(cz.skrisjak.crew_planner.subscription.Notification payload, Predicate<User> userFilter) {
        if (pushService != null) {
            List<PushSubscription> subscriptions = repository.findAll();
            for (PushSubscription subscription : subscriptions) {
                if (userFilter.test(subscription.getUser())) {
                    try {
                        HttpResponse response = pushService.send(new Notification(new Subscription(subscription.getEndpoint(), new Subscription.Keys(subscription.getKeys().getP256dh(), subscription.getKeys().getAuth())), objectMapper.writeValueAsString(payload)));
                        if (response.getStatusLine().getStatusCode() != 201) {
                            LOG.warn("Notification failed: {}", response.getStatusLine().toString() + "\n" + response.getEntity().toString());
                        }
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
