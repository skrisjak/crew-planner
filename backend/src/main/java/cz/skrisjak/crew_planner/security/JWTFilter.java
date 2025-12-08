package cz.skrisjak.crew_planner.security;

import cz.skrisjak.crew_planner.user.User;
import cz.skrisjak.crew_planner.user.UserService;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(JWTFilter.class);

    private final JwtParser jwtParser;
    private UserService userService;

    @Autowired
    public JWTFilter(@Value("${security.jwt.secret}") String secret, UserService userService) {
        super();
        this.jwtParser = Jwts.parser().setSigningKey(secret.getBytes()).build();
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header !=null && header.startsWith("Bearer ")) {
            String token ="";
            try {
                token = header.substring(7);

                String userEmail = extractUsername(token);
                User user = userService.authorize(userEmail);
                if (user != null) {
                    LOG.info("User " + userEmail + " authorized");
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, getUserAuthorities(user)));
                }
            } catch (Exception ignored) {
                LOG.warn("Invalid JWT token: {}", token);
            }
        }
        filterChain.doFilter(request, response);
    }

    public String extractUsername(String jwtToken) {
        return jwtParser.parseClaimsJws(jwtToken).getBody().getSubject();
    }

    private List<GrantedAuthority> getUserAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        String role = user.getRole().toString();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return authorities;
    }
}
