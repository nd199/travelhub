package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum VehicleStatus {
    ACTIVE,
    INACTIVE,
    MAINTENANCE,
    RETIRED;

    @JsonCreator
    public static VehicleStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return VehicleStatus.valueOf(value.toUpperCase());
    }
}
