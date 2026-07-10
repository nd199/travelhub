package com.naren.backend.service;

import com.naren.backend.record.BookingRequest;
import com.naren.backend.dto.BookingResponse;

import java.util.List;

public interface BookingService {
    
    BookingResponse createBooking(BookingRequest request);
    
    BookingResponse getBookingById(String id);
    
    BookingResponse getBookingByReference(String bookingReference);
    
    List<BookingResponse> getAllBookings();
    
    List<BookingResponse> getBookingsByUserId(String userId);
    
    List<BookingResponse> getBookingsByStatus(String status);
    
    List<BookingResponse> getBookingsByScheduleId(String scheduleId);
    
    BookingResponse updateBookingStatus(String id, String status);
    
    void deleteBooking(String id);
    
    List<BookingResponse> getBookingsByUserIdAndStatus(String userId, String status);
    
    Long getBookingCountByUserId(String userId);
    
    Double getTotalRevenueByUser(String userId);
    
    Double getTotalRevenueByUserOnYear(Long year, String userId);
    
    Double getTotalRevenueOnYear(Long year);
    
    Long getTotalBookingsOnYear(Long year);
}
