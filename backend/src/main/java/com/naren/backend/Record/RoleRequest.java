package com.naren.backend.Record;

import jakarta.validation.constraints.NotBlank;

public record RoleRequest(
        @NotBlank(message = "Name is required")
        String name,

        String description
) {
}
