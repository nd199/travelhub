package com.naren.backend.controller;

import com.naren.backend.dto.BusPhotoResponse;
import com.naren.backend.service.BusPhotoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus-photos")
@Tag(name = "Bus Photos")
public class BusPhotoController {

    private final BusPhotoService busPhotoService;

    public BusPhotoController(BusPhotoService busPhotoService) {
        this.busPhotoService = busPhotoService;
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<BusPhotoResponse>> getPhotosByVehicle(@PathVariable String vehicleId) {
        return ResponseEntity.ok(busPhotoService.getPhotosByVehicle(vehicleId));
    }

    @GetMapping("/vehicle/{vehicleId}/primary")
    public ResponseEntity<BusPhotoResponse> getPrimaryPhoto(@PathVariable String vehicleId) {
        return ResponseEntity.ok(busPhotoService.getPrimaryPhoto(vehicleId));
    }
}
