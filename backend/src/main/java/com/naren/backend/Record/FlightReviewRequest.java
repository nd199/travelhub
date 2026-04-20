package com.naren.backend.record;

public record FlightReviewRequest(
    String flightId,
    Integer rating,
    String comment,
    String userId
) {
}
