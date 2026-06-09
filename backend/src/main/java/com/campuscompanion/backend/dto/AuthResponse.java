package com.campuscompanion.backend.dto;

import com.campuscompanion.backend.entity.User;

public class AuthResponse {

    private final String token;
    private final Long userId;
    private final String name;
    private final String email;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.userId = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
