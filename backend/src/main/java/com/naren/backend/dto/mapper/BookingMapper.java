package com.naren.backend.dto.mapper;

import com.naren.backend.entity.Booking;
import com.naren.backend.dto.BookingResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class BookingMapper implements Function<Booking, BookingResponse> {

    @Override
    public BookingResponse apply(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getUser().getId(),
                booking.getSchedule().getId(),
                booking.getStatus().name(),
                booking.getTotalAmount(),
                booking.getDiscountAmount(),
                booking.getTaxAmount(),
                booking.getFinalAmount(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
