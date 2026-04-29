package com.naren.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record ExpandedBusResponse(
    String id,
    String operator,
    String from,
    String to,
    String date,
    LocalDateTime departure,
    LocalDateTime arrival,
    String duration,
    Double price,
    String type,
    Integer seats,
    Integer totalSeats,
    String busKind,
    Double rating,
    Integer reviews,
    List<String> peoplesChoice,
    Map<String, Boolean> amenities,
    List<BusPhotoResponse> photos,
    List<BoardingPointResponse> boardingPoints,
    List<BoardingPointResponse> droppingPoints,
    List<ReviewResponse> recentReviews,
    ReviewsSummaryResponse reviewsSummary,
    List<PolicyResponse> policies
) {
}
