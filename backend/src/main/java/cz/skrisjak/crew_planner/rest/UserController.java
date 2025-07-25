package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.data.ResponseUser;
import cz.skrisjak.crew_planner.mapper.UserMapper;
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
import java.util.NoSuchElementException;

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
    public ResponseEntity<ResponseUser> me(@AuthenticationPrincipal User user) {
        try {
            User me = userService.findByEmail(user.getEmail());
            return new ResponseEntity<>(UserMapper.map(me), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ResponseUser> createUser(@RequestBody PostUser newUser) {
        if (newUser == null) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = userService.createNewUser(newUser);
        return ResponseEntity.ok(UserMapper.map(user));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ResponseUser> updateUser(@RequestBody PostUser updateUser) {
        try {
            User update = userService.updateUser(updateUser);
            return ResponseEntity.accepted().body(UserMapper.map(update));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteUser(@RequestParam(name = "userEmail") String userEmail) {
        try {
            userService.deleteUser(userEmail);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping(path = "/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ResponseUser>> getAllUsers() {
       return ResponseEntity.ok(userService.getWorkingUsers().stream().map(UserMapper::map).toList());
    }
}