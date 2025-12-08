package cz.skrisjak.crew_planner.util;

import cz.skrisjak.crew_planner.subscription.PushSubscription;
import cz.skrisjak.crew_planner.user.User;
import cz.skrisjak.crew_planner.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class FallBackController {

    private SubscriptionService subscriptionService;

    @Autowired
    public FallBackController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @Value("${vapid.public}")
    private String vapidPublic;


    @GetMapping({"/home/**", "/users/**", "/hours/**", "/shopList/**"})
    public String fallback() {
        return "forward:/index.html";
    }

    @GetMapping("/vapidKey")
    public ResponseEntity<String> getVapidKey() {
        return ResponseEntity.ok(vapidPublic);
    }

    @PostMapping("/subscribe")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscription subscription, @AuthenticationPrincipal User user) {
        subscriptionService.subscribe(subscription, user);
        return ResponseEntity.ok().build();
    }
}