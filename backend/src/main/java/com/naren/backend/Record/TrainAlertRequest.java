package com.naren.backend.record;

import java.time.LocalDateTime;

public record TrainAlertRequest(
    String origin,
    String destination,
    LocalDateTime departureDate,
    Double maxPrice,
    String trainClass
) {
}
