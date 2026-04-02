package com.naren.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PassengerRequest(
        @NotBlank(message = "Booking ID is required")
        String bookingId,

        String seatId,

        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Age is required")
        Integer age,

        String gender,

        String contactNumber,

        String email,

        String idProofType,

        String idProofNumber
) {
}
