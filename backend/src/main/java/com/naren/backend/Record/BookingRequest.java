package com.naren.backend.record;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record BookingRequest(
    @NotNull(message = "Schedule ID is required")
    Long scheduleId,
    
    @NotNull(message = "User ID is required")
    Long userId,
    
    @NotNull(message = "Passengers are required")
    List<PassengerRequest> passengers,
    
    @NotNull(message = "Total amount is required")
    Double totalAmount,
    
    Double discountAmount,
    
    Double taxAmount,
    
    Double finalAmount
) {}
