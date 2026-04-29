package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SeatStatus {
    AVAILABLE,
    BOOKED,
    RESERVED,
    BLOCKED;

    @JsonCreator
    public static SeatStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return SeatStatus.valueOf(value.toUpperCase());
    }
}
