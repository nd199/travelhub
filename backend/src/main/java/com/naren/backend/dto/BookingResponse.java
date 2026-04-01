package com.naren.backend.DTO;

import java.time.LocalDateTime;

public record BookingResponse(
        String id,
        String bookingReference,
        String userId,
        String scheduleId,
        String status,
        Double totalAmount,
        Double discountAmount,
        Double taxAmount,
        Double finalAmount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
