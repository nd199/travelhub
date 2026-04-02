package com.naren.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ScheduleRequest(
        @NotBlank(message = "Vehicle ID is required")
        String vehicleId,

        @NotBlank(message = "Route ID is required")
        String routeId,

        @NotNull(message = "Departure time is required")
        LocalDateTime departureTime,

        @NotNull(message = "Arrival time is required")
        LocalDateTime arrivalTime,

        LocalDateTime actualDepartureTime,

        LocalDateTime actualArrivalTime,

        @NotNull(message = "Price is required")
        Double price,

        @NotNull(message = "Available seats is required")
        Integer availableSeats,

        @NotBlank(message = "Status is required")
        String status
) {
}
