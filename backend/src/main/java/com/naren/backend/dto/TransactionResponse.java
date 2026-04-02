package com.naren.backend.dto;

import java.time.LocalDateTime;

public record TransactionResponse(
        String id,
        String paymentId,
        String transactionReference,
        Double amount,
        String currency,
        String gatewayName,
        String gatewayTransactionId,
        String gatewayResponse,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
