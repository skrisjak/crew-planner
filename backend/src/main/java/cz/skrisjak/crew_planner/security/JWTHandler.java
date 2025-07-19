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
import java.util.Optional;

@Component
public class JWTHandler implements AuthenticationSuccessHandler {
    private UserRepository userRepository;

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${address}")
    private String frontend;

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

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.sendRedirect(frontend + "#error=Unauthorized");
                return;
            }
            user = optionalUser.get();
            user.setImage(oidcUser.getPicture());
            if (user.getName() == null) {
                user.setName(oidcUser.getFullName());
            }
            userRepository.save(user);
            response.sendRedirect(frontend + "#token=" + generateToken(email));
        } else {
            throw new ServletException("Unexpected principal type: " + principal.getClass().getName());
        }
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