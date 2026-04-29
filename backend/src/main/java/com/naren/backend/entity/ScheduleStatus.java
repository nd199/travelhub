package com.naren.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ScheduleStatus {
    SCHEDULED,
    ACTIVE,
    COMPLETED,
    CANCELLED,
    DELAYED;

    @JsonCreator
    public static ScheduleStatus fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        return ScheduleStatus.valueOf(value.toUpperCase());
    }
}
