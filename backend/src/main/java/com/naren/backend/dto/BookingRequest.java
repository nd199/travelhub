package com.naren.backend.dto;

import java.util.List;

public record BookingRequest(
        String scheduleId,
        List<String> seatIds,
        Double price
) {
}
