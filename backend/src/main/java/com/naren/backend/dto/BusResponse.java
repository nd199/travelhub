package com.naren.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BusResponse(
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
    List<String> peoplesChoice
) {
}
