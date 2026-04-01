package com.naren.backend.DTO;

import java.time.LocalDateTime;

public record BookingSeatResponse(
        String id,
        String bookingId,
        String seatId,
        Double price,
        LocalDateTime createdAt
) {
}
