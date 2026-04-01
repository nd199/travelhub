package com.naren.backend.DTO;

import java.time.LocalDateTime;

public record PassengerResponse(
        String id,
        String bookingId,
        String seatId,
        String name,
        Integer age,
        String gender,
        String contactNumber,
        String email,
        String idProofType,
        String idProofNumber,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
