package cz.skrisjak.crew_planner.data;

import cz.skrisjak.crew_planner.model.Role;
import lombok.Data;

@Data
public class ResponseUser {
    private String email;
    private String name;
    private String nickName;
    private String image;
    private Role role;
}
