package com.naren.backend.Record;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String profileImageUrl,
        String gender,
        String roleId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
