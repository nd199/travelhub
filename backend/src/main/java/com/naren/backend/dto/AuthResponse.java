package com.naren.backend.dto;

public record AuthResponse(
        String token,
        String refreshToken,
        String email,
        String firstName,
        String lastName
) {
}
