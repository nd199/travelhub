package com.naren.backend.Service;

import com.naren.backend.DTO.BookingResponse;
import com.naren.backend.Record.BookingRequest;

import java.util.List;

public interface BookingServiceInterface {
    BookingResponse createBooking(BookingRequest bookingRequest);
    BookingResponse getBookingById(String id);
    BookingResponse getBookingByReference(String bookingReference);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getBookingsByUserId(String userId);
    List<BookingResponse> getBookingsByStatus(String status);
    List<BookingResponse> getBookingsByScheduleId(String scheduleId);
    BookingResponse updateBookingStatus(String id, String status);
    void deleteBooking(String id);
}
