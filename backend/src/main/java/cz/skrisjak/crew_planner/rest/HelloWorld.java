package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HelloWorld {

    @GetMapping
    public ResponseEntity<String> hello(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>("Hello " + user.getEmail(), HttpStatus.OK);
    }
}
