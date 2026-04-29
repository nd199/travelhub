package com.naren.backend.dto;

import java.time.LocalDateTime;

public record BusPhotoResponse(
    String id,
    String vehicleId,
    String photoUrl,
    String caption,
    String photoType,
    Integer displayOrder,
    Boolean isPrimary,
    LocalDateTime createdAt
) {
}
