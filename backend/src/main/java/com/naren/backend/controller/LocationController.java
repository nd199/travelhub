package com.naren.backend.controller;

import com.naren.backend.dto.LocationResponse;
import com.naren.backend.dto.LocationRequest;
import com.naren.backend.service.LocationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Location")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<LocationResponse> createLocation(@Valid @RequestBody LocationRequest request) {
        return new ResponseEntity<>(locationService.createLocation(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationResponse> getLocationById(@PathVariable String id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }

    @GetMapping
    public ResponseEntity<List<LocationResponse>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<LocationResponse>> getLocationsByCity(@PathVariable String city) {
        return ResponseEntity.ok(locationService.getLocationsByCity(city));
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<LocationResponse>> getLocationsByCountry(@PathVariable String country) {
        return ResponseEntity.ok(locationService.getLocationsByCountry(country));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationResponse>> getLocationsByType(@PathVariable String type) {
        return ResponseEntity.ok(locationService.getLocationsByType(type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationResponse> updateLocation(@PathVariable String id, @Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(locationService.updateLocation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable String id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<LocationResponse>> getLocationsByState(@PathVariable String state) {
        return ResponseEntity.ok(locationService.getLocationsByState(state));
    }

    @GetMapping("/city-type")
    public ResponseEntity<List<LocationResponse>> getLocationsByCityAndType(@RequestParam String city, @RequestParam String type) {
        return ResponseEntity.ok(locationService.getLocationsByCityAndType(city, type));
    }

    @GetMapping("/count/type/{type}")
    public ResponseEntity<Long> getLocationCountByType(@PathVariable String type) {
        return ResponseEntity.ok(locationService.getLocationCountByType(type));
    }
}
