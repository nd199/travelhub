package com.naren.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VehicleRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Type is required")
        String type,

        @NotNull(message = "Capacity is required")
        Integer capacity,

        String amenities,

        @NotBlank(message = "Status is required")
        String status,

        String registrationNumber
) {
}
