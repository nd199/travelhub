package com.naren.backend.dto;

public record ReviewsSummaryResponse(
    Double averageRating,
    Long totalReviews,
    Long fiveStarReviews,
    Long fourStarReviews,
    Long threeStarReviews,
    Long twoStarReviews,
    Long oneStarReviews
) {
}
