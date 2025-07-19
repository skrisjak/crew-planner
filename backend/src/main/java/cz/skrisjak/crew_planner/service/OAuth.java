package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class OAuth extends DefaultOAuth2UserService {

    private UserService userService;

    @Autowired
    public OAuth(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");

        User user = userService.authorize(email);

        if (user == null) {
            throw new OAuth2AuthenticationException(new OAuth2Error("not_invited"),"User not invited");
        }
        return oAuth2User;
    }
}