package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum RouteStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED;

    @JsonCreator
    public static RouteStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return RouteStatus.valueOf(value.toUpperCase());
    }
}
