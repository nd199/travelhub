package com.naren.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LocationRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "City is required")
        String city,

        String state,

        @NotBlank(message = "Country is required")
        String country,

        Double latitude,

        Double longitude,

        @NotBlank(message = "Type is required")
        String type,

        String address,

        String pincode
) {
}
