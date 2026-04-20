package com.naren.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record SeatRequest(
        @NotBlank(message = "Vehicle ID is required")
        String vehicleId,

        @NotBlank(message = "Seat number is required")
        String seatNumber,

        String type,

        @NotBlank(message = "Status is required")
        String status,

        Double price
) {
}
