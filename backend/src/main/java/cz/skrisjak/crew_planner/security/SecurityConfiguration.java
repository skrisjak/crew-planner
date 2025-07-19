package cz.skrisjak.crew_planner.security;

import cz.skrisjak.crew_planner.service.OAuth;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.ForwardedHeaderFilter;

import java.util.List;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {
    private OAuth oAuth;
    private JWTHandler jwtHandler;
    private JWTFilter jwtFilter;


    @Autowired
    public SecurityConfiguration(OAuth oAuth, JWTHandler jwtHandler, JWTFilter jwtFilter) {
        this.oAuth = oAuth;
        this.jwtHandler = jwtHandler;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(
                                "/",
                                "/index.html",
                                "/static/*",
                                "/oauth2/**",
                                "/favicon.ico",
                                "/manifest.json",
                                "/logo*.png",
                                "/asset-manifest.json",
                                "/google.svg"
                        ).permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(user -> user.userService(oAuth))
                        .successHandler(jwtHandler)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, ex) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                        })
                        .accessDeniedHandler((request, response, ex) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        })
                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public FilterRegistrationBean<ForwardedHeaderFilter> forwardedHeaderFilter() {
        FilterRegistrationBean<ForwardedHeaderFilter> bean = new FilterRegistrationBean<>(new ForwardedHeaderFilter());
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }


}
