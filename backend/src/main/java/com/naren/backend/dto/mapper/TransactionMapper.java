package com.naren.backend.dto.mapper;

import com.naren.backend.Entity.Transaction;
import com.naren.backend.Record.TransactionResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class TransactionMapper implements Function<Transaction, TransactionResponse> {

    @Override
    public TransactionResponse apply(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getPayment().getId(),
                transaction.getTransactionReference(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getGatewayName(),
                transaction.getGatewayTransactionId(),
                transaction.getGatewayResponse(),
                transaction.getStatus().name(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}
