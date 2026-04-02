package com.naren.backend.record;

import jakarta.validation.constraints.NotBlank;

public record RouteRequest(
        @NotBlank(message = "Source location ID is required")
        String sourceLocationId,

        @NotBlank(message = "Destination location ID is required")
        String destinationLocationId,

        Double distanceKm,

        Integer estimatedDurationMinutes,

        String description,

        @NotBlank(message = "Status is required")
        String status
) {
}
