package com.naren.backend.dto.mapper;

import com.naren.backend.Entity.Payment;
import com.naren.backend.Record.PaymentResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PaymentMapper implements Function<Payment, PaymentResponse> {

    @Override
    public PaymentResponse apply(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus().name(),
                payment.getMethod(),
                payment.getTransactionReference(),
                payment.getGatewayTransactionId(),
                payment.getGatewayResponse(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}
