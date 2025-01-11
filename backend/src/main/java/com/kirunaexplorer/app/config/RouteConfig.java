package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.filter.LoginFilter;
import com.kirunaexplorer.app.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
public class RouteConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private LoginFilter loginFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF (useful for stateless JWT)
                .authorizeHttpRequests(auth -> auth
                        // Allow all OPTIONS requests for preflight checks
                        .requestMatchers(OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/v1/documents/map").permitAll()
                        .requestMatchers("/api/v1/documents/{id}").permitAll()

                        // Login
                        .requestMatchers(POST, "/api/v1/login").permitAll()
                        .requestMatchers(POST, "/api/v1/signin").permitAll()

                        // Documents (public GET)
                        .requestMatchers(GET, "/api/v1/documents").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/search").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/search-map").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/{id}/files").permitAll()
                        .requestMatchers(GET, "/api/v1/documents/area/{areaName}").permitAll()

                        // Links (public GET)
                        .requestMatchers(GET, "/api/v1/links").permitAll()
                        .requestMatchers(GET, "/api/v1/links/{linkId}").permitAll()

                        // Stakeholders (public GET)
                        .requestMatchers(GET, "/api/v1/stakeholders").permitAll()

                        // Files
                        .requestMatchers(GET, "/api/v1/files/{fileId}").permitAll()  // Download files is public
                        .requestMatchers(POST, "/api/v1/documents/{id}/files").permitAll()
                        .requestMatchers(DELETE, "/api/v1/files/{fileId}").authenticated()

                        // Document Types
                        .requestMatchers(GET, "/api/v1/document-types").permitAll()

                        // Scales
                        .requestMatchers(GET, "/api/v1/scales").permitAll()

                        // Geolocation
                        .requestMatchers(GET, "/api/v1/areas/{id}").permitAll()
                        .requestMatchers(GET, "/api/v1/areas").permitAll()
                        .requestMatchers(GET, "/api/v1/points").permitAll()

                        // Protected endpoints (URBAN_PLANNER)
                        .requestMatchers(POST, "/api/v1/documents/{id}/links").authenticated()
                        .requestMatchers(PUT, "/api/v1/documents/{id}/links").authenticated()
                        .requestMatchers(POST, "/api/v1/documents").authenticated()
                        .requestMatchers(PUT, "/api/v1/documents").authenticated()
                        .requestMatchers(POST, "/api/v1/stakeholders").authenticated()
                        .requestMatchers(POST, "/api/v1/document-types").authenticated()
                        .requestMatchers(POST, "/api/v1/scales").authenticated()
                        .requestMatchers(POST, "/api/v1/areas").authenticated()
                        .requestMatchers(POST, "/api/v1/points").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(loginFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return auth.build();
    }
}
