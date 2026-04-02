package com.naren.backend.controller;

import com.naren.backend.dto.BookingResponse;
import com.naren.backend.record.BookingRequest;
import com.naren.backend.service.BookingServiceInterface;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingServiceInterface bookingService;

    public BookingController(BookingServiceInterface bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        BookingResponse response = bookingService.createBooking(bookingRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<BookingResponse> getBookingByReference(@PathVariable String bookingReference) {
        BookingResponse response = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable String userId) {
        List<BookingResponse> responses = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable String status) {
        List<BookingResponse> responses = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByScheduleId(@PathVariable String scheduleId) {
        List<BookingResponse> responses = bookingService.getBookingsByScheduleId(scheduleId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        BookingResponse response = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/travel-date")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDate(@RequestParam LocalDateTime travelDate) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDate(travelDate);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/travel-date/before")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBefore(@RequestParam LocalDateTime dateTime) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDateBefore(dateTime);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/travel-date/between")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBetween(
            @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDateBetween(start, end);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndStatus(
            @PathVariable String userId, @PathVariable String status) {
        List<BookingResponse> responses = bookingService.getBookingsByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/travel-date/between")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndTravelDateBetween(
            @PathVariable String userId, @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        List<BookingResponse> responses = bookingService.getBookingsByUserIdAndTravelDateBetween(userId, start, end);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> getBookingCountByUserId(@PathVariable String userId) {
        Long count = bookingService.getBookingCountByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/revenue/user/{userId}")
    public ResponseEntity<Double> getTotalRevenueByUser(@PathVariable String userId) {
        Double revenue = bookingService.getTotalRevenueByUser(userId);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/year/{year}/user/{userId}")
    public ResponseEntity<Double> getTotalRevenueByUserOnYear(
            @PathVariable Long year, @PathVariable String userId) {
        Double revenue = bookingService.getTotalRevenueByUserOnYear(year, userId);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/year/{year}")
    public ResponseEntity<Double> getTotalRevenueOnYear(@PathVariable Long year) {
        Double revenue = bookingService.getTotalRevenueOnYear(year);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/count/year/{year}")
    public ResponseEntity<Long> getTotalBookingsOnYear(@PathVariable Long year) {
        Long count = bookingService.getTotalBookingsOnYear(year);
        return ResponseEntity.ok(count);
    }
}
