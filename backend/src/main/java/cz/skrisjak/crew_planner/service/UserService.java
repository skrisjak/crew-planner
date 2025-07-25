package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.data.PostUser;
import cz.skrisjak.crew_planner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final ConcurrentHashMap<String,User> loggedInUsers = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authorize(String email) {
        if (loggedInUsers.containsKey(email)) {
            return loggedInUsers.get(email);
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            loggedInUsers.put(email, user);
        }
        return user;
    }

    public User updateUser(PostUser updateUser) {
        User user = userRepository.findByEmail(updateUser.getEmail()).orElseThrow();
        user.setName(updateUser.getName());
        user.setEmail(updateUser.getEmail());
        user.setNickName(updateUser.getNickName());
        user.setRole(updateUser.getRole());
        return userRepository.save(user);
    }

    public User createNewUser(PostUser newUser) {
        User user = new User();
        user.setEmail(newUser.getEmail());
        user.setName(newUser.getName());
        user.setNickName(newUser.getNickName());
        user.setRole(newUser.getRole());
        return userRepository.save(user);
    }

    public void deleteUser(String email) {
        User u = userRepository.findByEmail(email).orElseThrow();
        userRepository.delete(u);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<User> getWorkingUsers() {
        return userRepository.findAll();
    }
}
