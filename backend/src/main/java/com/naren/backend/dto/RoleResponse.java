package com.naren.backend.dto;

import java.time.LocalDateTime;

public record RoleResponse(
        String id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
