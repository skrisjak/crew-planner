package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.data.PostUser;
import cz.skrisjak.crew_planner.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
        User me = userService.findByEmail(user.getEmail());
        if (me == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(me, HttpStatus.OK);
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(ADMIN, MANAGER)")
    public ResponseEntity<User> createUser(@RequestBody PostUser newUser) {
        if (newUser == null) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = userService.createNewUser(newUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    @PreAuthorize("hasAnyRole(ADMIN, MANAGER)")
    public ResponseEntity<User> updateUser(@RequestBody PostUser updateUser) {
        try {
            User update = userService.updateUser(updateUser);
            return ResponseEntity.accepted().body(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}