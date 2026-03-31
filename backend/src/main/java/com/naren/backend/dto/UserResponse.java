package com.naren.backend.DTO;

import com.naren.backend.Entity.Gender;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String profileImageUrl,
        Gender gender,
        String roleId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
