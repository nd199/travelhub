package com.naren.backend.Record;

import java.time.LocalDateTime;

public record RouteResponse(
        String id,
        String sourceLocationId,
        String destinationLocationId,
        Double distanceKm,
        Integer estimatedDurationMinutes,
        String description,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
