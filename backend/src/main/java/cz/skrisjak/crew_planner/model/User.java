package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="app_user")
public class User {
    @Id
    private String email;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    private String name;
    private String nickName;
    private String imageUrl;
}