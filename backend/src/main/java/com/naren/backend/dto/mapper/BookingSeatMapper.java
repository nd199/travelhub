package com.naren.backend.DTO.mapper;

import com.naren.backend.Entity.BookingSeat;
import com.naren.backend.DTO.BookingSeatResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class BookingSeatMapper implements Function<BookingSeat, BookingSeatResponse> {

    @Override
    public BookingSeatResponse apply(BookingSeat bookingSeat) {
        return new BookingSeatResponse(
                bookingSeat.getId(),
                bookingSeat.getBooking().getId(),
                bookingSeat.getSeat().getId(),
                bookingSeat.getPrice(),
                bookingSeat.getCreatedAt()
        );
    }
}
