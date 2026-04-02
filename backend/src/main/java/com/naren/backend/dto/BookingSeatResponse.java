package com.naren.backend.dto;

import java.time.LocalDateTime;

public record BookingSeatResponse(
        String id,
        String bookingId,
        String seatId,
        Double price,
        LocalDateTime createdAt
) {
}
