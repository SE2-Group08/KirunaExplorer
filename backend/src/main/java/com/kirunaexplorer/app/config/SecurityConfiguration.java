package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.constants.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {
            "/api/v1/documents/{id}",
            "/api/v1/auth/authenticate",
            "/api/v1/auth/register",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req

                        .requestMatchers(WHITE_LIST_URL).permitAll()

                        .requestMatchers(GET, "/api/v1/documents").permitAll()

                        .requestMatchers(POST, "/api/v1/documents/{id}/links").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(PUT, "/api/v1/documents/{id}/links").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/documents").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(PUT, "/api/v1/documents").hasAuthority(Role.URBAN_PLANNER.name())

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
