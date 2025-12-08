package cz.skrisjak.crew_planner.util;

import cz.skrisjak.crew_planner.user.Role;
import cz.skrisjak.crew_planner.user.User;
import cz.skrisjak.crew_planner.user.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Initialization {

    private final UserRepository userRepository;

    @Autowired
    public Initialization(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        if (!userRepository.existsById("jskrisovsky06@gmail.com")) {
            User user = new User();
            user.setEmail("jskrisovsky06@gmail.com");
            user.setRole(Role.ADMIN);
            userRepository.save(user);
        }
    }
}