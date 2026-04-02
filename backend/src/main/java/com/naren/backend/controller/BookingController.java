package com.naren.backend.controller;

import com.naren.backend.dto.BookingResponse;
import com.naren.backend.record.BookingRequest;
import com.naren.backend.service.BookingServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking", description = "Booking management APIs")
public class BookingController {

    private final BookingServiceInterface bookingService;

    public BookingController(BookingServiceInterface bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        BookingResponse response = bookingService.createBooking(bookingRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reference/{bookingReference}")
    @Operation(summary = "Get booking by reference number")
    public ResponseEntity<BookingResponse> getBookingByReference(@PathVariable String bookingReference) {
        BookingResponse response = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by user ID")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable String userId) {
        List<BookingResponse> responses = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get bookings by status")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable String status) {
        List<BookingResponse> responses = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/schedule/{scheduleId}")
    @Operation(summary = "Get bookings by schedule ID")
    public ResponseEntity<List<BookingResponse>> getBookingsByScheduleId(@PathVariable String scheduleId) {
        List<BookingResponse> responses = bookingService.getBookingsByScheduleId(scheduleId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        BookingResponse response = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete booking")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/travel-date")
    @Operation(summary = "Get bookings by travel date")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDate(@RequestParam LocalDateTime travelDate) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDate(travelDate);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/travel-date/before")
    @Operation(summary = "Get bookings by travel date before")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBefore(@RequestParam LocalDateTime dateTime) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDateBefore(dateTime);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/travel-date/between")
    @Operation(summary = "Get bookings by travel date between")
    public ResponseEntity<List<BookingResponse>> getBookingsByTravelDateBetween(
            @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        List<BookingResponse> responses = bookingService.getBookingsByTravelDateBetween(start, end);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/status/{status}")
    @Operation(summary = "Get bookings by user ID and status")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndStatus(
            @PathVariable String userId, @PathVariable String status) {
        List<BookingResponse> responses = bookingService.getBookingsByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/travel-date/between")
    @Operation(summary = "Get bookings by user ID and travel date between")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserIdAndTravelDateBetween(
            @PathVariable String userId, @RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        List<BookingResponse> responses = bookingService.getBookingsByUserIdAndTravelDateBetween(userId, start, end);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/count/user/{userId}")
    @Operation(summary = "Get booking count by user ID")
    public ResponseEntity<Long> getBookingCountByUserId(@PathVariable String userId) {
        Long count = bookingService.getBookingCountByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/revenue/user/{userId}")
    @Operation(summary = "Get total revenue by user")
    public ResponseEntity<Double> getTotalRevenueByUser(@PathVariable String userId) {
        Double revenue = bookingService.getTotalRevenueByUser(userId);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/year/{year}/user/{userId}")
    @Operation(summary = "Get total revenue by user on year")
    public ResponseEntity<Double> getTotalRevenueByUserOnYear(
            @PathVariable Long year, @PathVariable String userId) {
        Double revenue = bookingService.getTotalRevenueByUserOnYear(year, userId);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/year/{year}")
    @Operation(summary = "Get total revenue on year")
    public ResponseEntity<Double> getTotalRevenueOnYear(@PathVariable Long year) {
        Double revenue = bookingService.getTotalRevenueOnYear(year);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/count/year/{year}")
    @Operation(summary = "Get total bookings on year")
    public ResponseEntity<Long> getTotalBookingsOnYear(@PathVariable Long year) {
        Long count = bookingService.getTotalBookingsOnYear(year);
        return ResponseEntity.ok(count);
    }
}
