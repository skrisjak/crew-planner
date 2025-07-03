package cz.skrisjak.crew_planner.repository;

import cz.skrisjak.crew_planner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
