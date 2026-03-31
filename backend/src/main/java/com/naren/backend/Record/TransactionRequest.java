package com.naren.backend.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TransactionRequest(
        @NotBlank(message = "Payment ID is required")
        String paymentId,

        @NotBlank(message = "Transaction reference is required")
        String transactionReference,

        @NotNull(message = "Amount is required")
        Double amount,

        String currency,

        String gatewayName,

        String gatewayTransactionId,

        @NotBlank(message = "Gateway response is required")
        String gatewayResponse,

        @NotBlank(message = "Status is required")
        String status
) {
}
