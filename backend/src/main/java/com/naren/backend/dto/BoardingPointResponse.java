package com.naren.backend.dto;

import java.time.LocalDateTime;

public record BoardingPointResponse(
    String id,
    String locationId,
    String locationName,
    String pointName,
    String address,
    String time,
    String landmark,
    String type,
    LocalDateTime createdAt
) {
}
