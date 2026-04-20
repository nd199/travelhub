package com.naren.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentRequest(
    @NotBlank(message = "Payment method is required")
    String paymentMethod,
    
    @NotBlank(message = "Card number is required")
    String cardNumber,
    
    @NotBlank(message = "Cardholder name is required")
    String cardholderName,
    
    @NotBlank(message = "Expiry date is required")
    String expiryDate,
    
    @NotBlank(message = "CVV is required")
    String cvv,
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    Double amount,
    
    String currency
) {}
