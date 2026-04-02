package com.naren.backend.dto;

import java.time.LocalDateTime;

public record SeatResponse(
        String id,
        String vehicleId,
        String seatNumber,
        String type,
        String status,
        Double price,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
