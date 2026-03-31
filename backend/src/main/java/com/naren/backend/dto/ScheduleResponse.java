package com.naren.backend.Record;

import java.time.LocalDateTime;

public record ScheduleResponse(
        String id,
        String vehicleId,
        String routeId,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        LocalDateTime actualDepartureTime,
        LocalDateTime actualArrivalTime,
        Double price,
        Integer availableSeats,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
