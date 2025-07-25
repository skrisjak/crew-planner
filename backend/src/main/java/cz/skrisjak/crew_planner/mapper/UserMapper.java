package cz.skrisjak.crew_planner.mapper;

import cz.skrisjak.crew_planner.data.ResponseUser;
import cz.skrisjak.crew_planner.model.User;

public class UserMapper {
    public static ResponseUser map(User user) {
        ResponseUser responseUser = new ResponseUser();
        responseUser.setEmail(user.getEmail());
        responseUser.setName(user.getName());
        responseUser.setRole(user.getRole());
        responseUser.setImage(user.getImage());
        return responseUser;
    }
}
