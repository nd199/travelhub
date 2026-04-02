package com.naren.backend.dto.mapper;

import com.naren.backend.entity.BookingSeat;
import com.naren.backend.dto.BookingSeatResponse;
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
