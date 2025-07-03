package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class UserService {

    private ConcurrentHashMap<String,User> loggedInUsers = new ConcurrentHashMap<>();
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authorize(String email) throws Exception {
        if (loggedInUsers.containsKey(email)) {
            return loggedInUsers.get(email);
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User " + email + "not found");
        }
        loggedInUsers.put(email, user);
        return user;
    }


    @Scheduled(fixedRate = 60000)
    public void flushCache() {
        loggedInUsers.clear();
    }
}
