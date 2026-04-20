package com.naren.backend.record;

import java.time.LocalDateTime;

public record TrainSearchRequest(
    String origin,
    String destination,
    LocalDateTime departureDate,
    LocalDateTime returnDate,
    Integer passengers,
    String trainClass
) {
}
