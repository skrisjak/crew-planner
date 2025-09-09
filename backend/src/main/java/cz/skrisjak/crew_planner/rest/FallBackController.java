package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.data.PushSubscription;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class FallBackController {

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
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscription subscription) {
        System.out.println(subscription);
        return ResponseEntity.ok().build();
    }
}