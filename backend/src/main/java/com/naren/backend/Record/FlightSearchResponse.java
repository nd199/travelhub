package com.naren.backend.record;

import java.time.LocalDateTime;
import java.util.List;

public record FlightSearchResponse(
    String flightId,
    String flightNumber,
    String origin,
    String destination,
    LocalDateTime departureTime,
    LocalDateTime arrivalTime,
    String airline,
    Double price,
    String cabinClass,
    Integer availableSeats,
    List<String> amenities
) {
}
