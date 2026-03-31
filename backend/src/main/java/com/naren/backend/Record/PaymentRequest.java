package com.naren.backend.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
        @NotBlank(message = "Booking ID is required")
        String bookingId,

        @NotNull(message = "Amount is required")
        Double amount,

        String currency,

        @NotBlank(message = "Method is required")
        String method,

        String transactionReference,

        String gatewayTransactionId,

        String gatewayResponse
) {
}
