package com.naren.backend.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    String id,
    String vehicleId,
    String userName,
    Integer rating,
    String comment,
    LocalDateTime travelDate,
    Integer helpfulCount,
    Boolean verified,
    LocalDateTime createdAt
) {
}
