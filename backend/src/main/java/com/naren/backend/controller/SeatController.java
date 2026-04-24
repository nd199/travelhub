package com.naren.backend.controller;

import com.naren.backend.dto.SeatResponse;
import com.naren.backend.service.SeatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@Tag(name = "Seat")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
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
}
