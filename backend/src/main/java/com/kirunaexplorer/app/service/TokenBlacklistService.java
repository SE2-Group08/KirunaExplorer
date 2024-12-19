package com.kirunaexplorer.app.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void addTokenToBlacklist(String token, long expiration) {
        blacklist.put(token, System.currentTimeMillis() + expiration);
    }

    public boolean isTokenBlacklisted(String token) {
        blacklist.entrySet().removeIf(entry -> entry.getValue() < System.currentTimeMillis());
        return blacklist.containsKey(token);
    }
}
