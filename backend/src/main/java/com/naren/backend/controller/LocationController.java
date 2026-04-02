package com.naren.backend.controller;

import com.naren.backend.dto.LocationResponse;
import com.naren.backend.record.LocationRequest;
import com.naren.backend.service.LocationServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Location", description = "Location management APIs")
public class LocationController {

    private final LocationServiceInterface locationService;

    public LocationController(LocationServiceInterface locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    @Operation(summary = "Create a new location")
    public ResponseEntity<LocationResponse> createLocation(@Valid @RequestBody LocationRequest request) {
        return new ResponseEntity<>(locationService.createLocation(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get location by ID")
    public ResponseEntity<LocationResponse> getLocationById(@PathVariable String id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }

    @GetMapping
    @Operation(summary = "Get all locations")
    public ResponseEntity<List<LocationResponse>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get locations by city")
    public ResponseEntity<List<LocationResponse>> getLocationsByCity(@PathVariable String city) {
        return ResponseEntity.ok(locationService.getLocationsByCity(city));
    }

    @GetMapping("/country/{country}")
    @Operation(summary = "Get locations by country")
    public ResponseEntity<List<LocationResponse>> getLocationsByCountry(@PathVariable String country) {
        return ResponseEntity.ok(locationService.getLocationsByCountry(country));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get locations by type")
    public ResponseEntity<List<LocationResponse>> getLocationsByType(@PathVariable String type) {
        return ResponseEntity.ok(locationService.getLocationsByType(type));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update location")
    public ResponseEntity<LocationResponse> updateLocation(@PathVariable String id, @Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(locationService.updateLocation(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete location")
    public ResponseEntity<Void> deleteLocation(@PathVariable String id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/state/{state}")
    @Operation(summary = "Get locations by state")
    public ResponseEntity<List<LocationResponse>> getLocationsByState(@PathVariable String state) {
        return ResponseEntity.ok(locationService.getLocationsByState(state));
    }

    @GetMapping("/city-type")
    @Operation(summary = "Get locations by city and type")
    public ResponseEntity<List<LocationResponse>> getLocationsByCityAndType(@RequestParam String city, @RequestParam String type) {
        return ResponseEntity.ok(locationService.getLocationsByCityAndType(city, type));
    }

    @GetMapping("/count/type/{type}")
    @Operation(summary = "Get location count by type")
    public ResponseEntity<Long> getLocationCountByType(@PathVariable String type) {
        return ResponseEntity.ok(locationService.getLocationCountByType(type));
    }
}
