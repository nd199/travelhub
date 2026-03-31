package com.naren.backend.Record;

import java.time.LocalDateTime;

public record PaymentResponse(
        String id,
        String bookingId,
        Double amount,
        String currency,
        String status,
        String method,
        String transactionReference,
        String gatewayTransactionId,
        String gatewayResponse,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
