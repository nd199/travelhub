package com.naren.backend.controller;

import com.naren.backend.entity.Route;
import com.naren.backend.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Route>> getActiveRoutes() {
        return ResponseEntity.ok(routeService.getActiveRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable Long id) {
        try {
            Route route = routeService.getRouteById(id);
            return ResponseEntity.ok(route);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Route>> searchRoutes(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime) {
        return ResponseEntity.ok(routeService.searchAvailableRoutes(source, destination, departureTime));
    }

    @GetMapping("/source/{source}")
    public ResponseEntity<List<Route>> getRoutesBySource(@PathVariable String source) {
        return ResponseEntity.ok(routeService.getRoutesBySource(source));
    }

    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<Route>> getRoutesByDestination(@PathVariable String destination) {
        return ResponseEntity.ok(routeService.getRoutesByDestination(destination));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Route>> getRoutesByVehicleId(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(routeService.getRoutesByVehicleId(vehicleId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<?> createRoute(@Valid @RequestBody Route route) {
        try {
            Route createdRoute = routeService.createRoute(route);
            return ResponseEntity.ok(createdRoute);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<?> updateRoute(@PathVariable Long id, @Valid @RequestBody Route routeDetails) {
        try {
            Route updatedRoute = routeService.updateRoute(id, routeDetails);
            return ResponseEntity.ok(updatedRoute);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Route deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
