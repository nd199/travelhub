package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED;

    @JsonCreator
    public static BookingStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return BookingStatus.valueOf(value.toUpperCase());
    }
}
