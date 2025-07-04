package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.postentities.PostUser;
import cz.skrisjak.crew_planner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private void flushCache() {
        loggedInUsers.clear();
    }

    public User updateUser(PostUser updateUser) throws Exception {
        User user = userRepository.findByEmail(updateUser.getEmail());
        if(user == null) {
            throw new Exception("User not found");
        }
        user.setName(updateUser.getName());
        user.setEmail(updateUser.getEmail());
        user.setRole(updateUser.getRole());
        return userRepository.save(user);
    }

    public User createNewUser(PostUser newUser) {
        User user = new User();
        user.setEmail(newUser.getEmail());
        user.setName(newUser.getName());
        user.setRole(newUser.getRole());
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
