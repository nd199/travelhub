package com.naren.backend.dto;

import java.time.LocalDateTime;

public record PolicyResponse(
    String id,
    String vehicleId,
    String title,
    String description,
    String[] rules,
    String icon,
    String policyType,
    LocalDateTime createdAt
) {
}
