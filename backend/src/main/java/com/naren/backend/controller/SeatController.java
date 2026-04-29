package com.naren.backend.controller;

import com.naren.backend.dto.SeatResponse;
import com.naren.backend.record.BookingRequest;
import com.naren.backend.dto.BookingResponse;
import com.naren.backend.service.SeatService;
import com.naren.backend.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@Tag(name = "Seat")
public class SeatController {

    private final SeatService seatService;
    private final BookingService bookingService;

    public SeatController(SeatService seatService, BookingService bookingService) {
        this.seatService = seatService;
        this.bookingService = bookingService;
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByVehicleId(@PathVariable String vehicleId) {
        return ResponseEntity.ok(seatService.getSeatsByVehicleId(vehicleId));
    }

    @GetMapping("/vehicle/{vehicleId}/available")
    public ResponseEntity<List<SeatResponse>> getAvailableSeatsByVehicleId(@PathVariable String vehicleId) {
        return ResponseEntity.ok(seatService.getAvailableSeatsByVehicleId(vehicleId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatResponse> getSeatById(@PathVariable String id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookSeats(@RequestBody BookingRequest bookingRequest) {
        return ResponseEntity.ok(bookingService.createBooking(bookingRequest));
    }
}
