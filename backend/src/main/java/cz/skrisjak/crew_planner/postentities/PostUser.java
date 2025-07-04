package cz.skrisjak.crew_planner.postentities;

import cz.skrisjak.crew_planner.model.Role;
import lombok.Data;

@Data
public class PostUser {
    private String email;
    private String name;
    private Role role;
}
