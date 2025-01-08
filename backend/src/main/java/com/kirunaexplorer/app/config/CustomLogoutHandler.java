package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.service.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements org.springframework.security.web.authentication.logout.LogoutHandler {

    private final TokenBlacklistService tokenBlacklistService;
    private final JwtConfig jwtConfig;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            long expiry = jwtConfig.getExpiry();
            tokenBlacklistService.addTokenToBlacklist(jwt, expiry);
        }
    }
}
