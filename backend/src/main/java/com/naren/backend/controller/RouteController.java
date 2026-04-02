package com.naren.backend.controller;

import com.naren.backend.dto.RouteResponse;
import com.naren.backend.record.RouteRequest;
import com.naren.backend.service.RouteServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@Tag(name = "Route", description = "Route management APIs")
public class RouteController {

    private final RouteServiceInterface routeService;

    public RouteController(RouteServiceInterface routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    @Operation(summary = "Create a new route")
    public ResponseEntity<RouteResponse> createRoute(@Valid @RequestBody RouteRequest request) {
        return new ResponseEntity<>(routeService.createRoute(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get route by ID")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable String id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }

    @GetMapping
    @Operation(summary = "Get all routes")
    public ResponseEntity<List<RouteResponse>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get routes by status")
    public ResponseEntity<List<RouteResponse>> getRoutesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(routeService.getRoutesByStatus(status));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update route")
    public ResponseEntity<RouteResponse> updateRoute(@PathVariable String id, @Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(routeService.updateRoute(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete route")
    public ResponseEntity<Void> deleteRoute(@PathVariable String id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cities")
    @Operation(summary = "Get routes by source and destination cities")
    public ResponseEntity<List<RouteResponse>> getRoutesByCities(@RequestParam String sourceCity, @RequestParam String destCity) {
        return ResponseEntity.ok(routeService.getRoutesByCities(sourceCity, destCity));
    }
}
