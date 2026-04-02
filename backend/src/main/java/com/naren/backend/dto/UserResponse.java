package com.naren.backend.dto;

import com.naren.backend.entity.Gender;

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
