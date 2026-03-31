package com.naren.backend.Record;

import java.time.LocalDateTime;

public record RoleResponse(
        String id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
