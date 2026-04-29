package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED;

    @JsonCreator
    public static PaymentStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return PaymentStatus.valueOf(value.toUpperCase());
    }
}
