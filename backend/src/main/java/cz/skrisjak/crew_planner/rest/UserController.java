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

import java.util.List;

@RestController
@RequestMapping("/user")
@PreAuthorize("isAuthenticated()")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
        try {
            User me = userService.findByEmail(user.getEmail());
            return new ResponseEntity<>(me, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<User> createUser(@RequestBody PostUser newUser) {
        if (newUser == null) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = userService.createNewUser(newUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<User> updateUser(@RequestBody PostUser updateUser) {
        try {
            User update = userService.updateUser(updateUser);
            return ResponseEntity.accepted().body(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping(path = "/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<User>> getAllUsers() {
       return ResponseEntity.ok(userService.getWorkingUsers());
    }
}