package com.naren.backend.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
        @NotBlank(message = "User ID is required")
        String userId,

        @NotBlank(message = "Schedule ID is required")
        String scheduleId,

        @NotNull(message = "Total amount is required")
        Double totalAmount,

        Double discountAmount,

        Double taxAmount,

        Double finalAmount
) {
}
