package com.naren.backend.dto;

import java.time.LocalDateTime;

public record VehicleResponse(
        String id,
        String name,
        String type,
        Integer capacity,
        String amenities,
        String status,
        String registrationNumber,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
