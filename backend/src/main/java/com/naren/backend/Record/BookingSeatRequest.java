package com.naren.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingSeatRequest(
        @NotBlank(message = "Booking ID is required")
        String bookingId,

        @NotBlank(message = "Seat ID is required")
        String seatId,

        @NotNull(message = "Price is required")
        Double price
) {
}
