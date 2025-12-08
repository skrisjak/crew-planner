package cz.skrisjak.crew_planner.user.data;

import cz.skrisjak.crew_planner.user.User;

public class UserMapper {
    public static ResponseUser map(User user) {
        ResponseUser responseUser = new ResponseUser();
        responseUser.setEmail(user.getEmail());
        responseUser.setName(user.getName());
        responseUser.setRole(user.getRole());
        responseUser.setImage(user.getImage());
        responseUser.setNickName(user.getNickName());
        return responseUser;
    }
}
