package com.naren.backend.record;

public record TrainReviewRequest(
    String trainId,
    Integer rating,
    String comment,
    String userId
) {
}
