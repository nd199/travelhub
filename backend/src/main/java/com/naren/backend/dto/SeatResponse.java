package com.naren.backend.DTO;

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
