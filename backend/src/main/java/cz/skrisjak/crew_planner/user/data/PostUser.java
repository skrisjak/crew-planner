package cz.skrisjak.crew_planner.user.data;

import cz.skrisjak.crew_planner.user.Role;
import lombok.Data;

@Data
public class PostUser {
    private String email;
    private String name;
    private String nickName;
    private Role role;
}
