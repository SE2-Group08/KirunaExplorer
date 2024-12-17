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
            "/api/v1/documents/map",
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
                .authorizeHttpRequests(auth -> auth
                        // Allow all OPTIONS requests for preflight checks
                        .requestMatchers(OPTIONS, "/**").permitAll()

                        .requestMatchers(WHITE_LIST_URL).permitAll()

                        // Auth
                        .requestMatchers(POST, "/api/v1/auth/authenticate").permitAll()
                        .requestMatchers(POST, "/api/v1/auth/register").permitAll()

                        // Documents (public GET)
                        .requestMatchers(GET, "/api/v1/documents").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/search").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/{id}/files").permitAll()

                        // Links (public GET)
                        .requestMatchers(GET, "/api/v1/links").permitAll()
                        .requestMatchers(GET, "/api/v1/links/{linkId}").permitAll()

                        // Stakeholders (public GET)
                        .requestMatchers(GET, "/api/v1/stakeholders").permitAll()

                        // Files
                        .requestMatchers(GET, "/api/v1/files/{fileId}").permitAll()  // Download files is public
                        .requestMatchers(POST, "/api/v1/documents/{id}/files").permitAll()
                        .requestMatchers(DELETE, "/api/v1/files/{fileId}").hasAuthority(Role.URBAN_PLANNER.name()) // Delete files requires URBAN_PLANNER

                        // Document Types
                        .requestMatchers(GET, "/api/v1/document-types").permitAll()

                        // Scales
                        .requestMatchers(GET, "/api/v1/scales").permitAll()

                        // Protected endpoints (URBAN_PLANNER)
                        .requestMatchers(POST, "/api/v1/documents/{id}/links").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(PUT, "/api/v1/documents/{id}/links").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/documents").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(PUT, "/api/v1/documents").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/stakeholders").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/document-types").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/scales").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(GET, "/api/v1/areas").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(POST, "/api/v1/areas").hasAuthority(Role.URBAN_PLANNER.name())
                        .requestMatchers(GET, "/api/v1/areas/{id}").hasAuthority(Role.URBAN_PLANNER.name())

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
