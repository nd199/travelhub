package com.naren.backend.record;

import java.time.LocalDateTime;
import java.util.List;

public record TrainSearchResponse(
    String trainId,
    String trainNumber,
    String origin,
    String destination,
    LocalDateTime departureTime,
    LocalDateTime arrivalTime,
    String trainName,
    Double price,
    String trainClass,
    Integer availableSeats,
    List<String> amenities
) {
}
