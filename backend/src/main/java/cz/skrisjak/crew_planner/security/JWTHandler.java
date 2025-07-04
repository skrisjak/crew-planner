package cz.skrisjak.crew_planner.security;

import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Date;

@Component
public class JWTHandler implements AuthenticationSuccessHandler {
    private UserRepository userRepository;

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${address}")
    private String client;

    @Autowired
    public JWTHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();

        String email;
        User user;

        if (principal instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();

            System.out.println(oidcUser);
            System.out.println("Picture: " +oidcUser.getPicture());

            user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ServletException("User has no access");
            }
            user.setImage(oidcUser.getPicture());
            userRepository.save(user);
        } else {
            throw new ServletException("Unexpected principal type: " + principal.getClass().getName());
        }
        response.sendRedirect(client + "#token=" + generateToken(email));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS256, secret.getBytes())
                .compact();
    }
}