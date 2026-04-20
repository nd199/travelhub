package com.naren.backend.controller;

import com.naren.backend.dto.BookingResponse;
import com.naren.backend.record.BookingRequest;
import com.naren.backend.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        return new ResponseEntity<>(bookingService.createBooking(bookingRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<BookingResponse> getBookingByReference(@PathVariable String bookingReference) {
        return ResponseEntity.ok(bookingService.getBookingByReference(bookingReference));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByScheduleId(@PathVariable String scheduleId) {
        return ResponseEntity.ok(bookingService.getBookingsByScheduleId(scheduleId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/travel-date")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDate(@RequestParam LocalDateTime travelDate) {
        return ResponseEntity.ok(bookingService.getBookingsByTravelDate(travelDate));
    }

    @GetMapping("/travel-date/before")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBefore(@RequestParam LocalDateTime dateTime) {
        return ResponseEntity.ok(bookingService.getBookingsByTravelDateBefore(dateTime));
    }

    @GetMapping("/travel-date/between")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBetween(
            @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(bookingService.getBookingsByTravelDateBetween(start, end));
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndStatus(
            @PathVariable String userId, @PathVariable String status) {
        return ResponseEntity.ok(bookingService.getBookingsByUserIdAndStatus(userId, status));
    }

    @GetMapping("/user/{userId}/travel-date/between")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndTravelDateBetween(
            @PathVariable String userId, @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(bookingService.getBookingsByUserIdAndTravelDateBetween(userId, start, end));
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> getBookingCountByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingCountByUserId(userId));
    }

    @GetMapping("/revenue/user/{userId}")
    public ResponseEntity<Double> getTotalRevenueByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getTotalRevenueByUser(userId));
    }

    @GetMapping("/revenue/year/{year}/user/{userId}")
    public ResponseEntity<Double> getTotalRevenueByUserOnYear(
            @PathVariable Long year, @PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getTotalRevenueByUserOnYear(year, userId));
    }

    @GetMapping("/revenue/year/{year}")
    public ResponseEntity<Double> getTotalRevenueOnYear(@PathVariable Long year) {
        return ResponseEntity.ok(bookingService.getTotalRevenueOnYear(year));
    }

    @GetMapping("/count/year/{year}")
    public ResponseEntity<Long> getTotalBookingsOnYear(@PathVariable Long year) {
        return ResponseEntity.ok(bookingService.getTotalBookingsOnYear(year));
    }
}
