package com.naren.backend.record;

import java.time.LocalDateTime;

public record FlightAlertRequest(
    String origin,
    String destination,
    LocalDateTime departureDate,
    Double maxPrice,
    String cabinClass
) {
}
