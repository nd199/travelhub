package com.naren.backend.controller;

import com.naren.backend.record.FlightSearchRequest;
import com.naren.backend.record.FlightSearchResponse;
import com.naren.backend.record.FlightAlertRequest;
import com.naren.backend.record.FlightReviewRequest;
import com.naren.backend.service.FlightService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@Tag(name = "Flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<FlightSearchResponse>> searchFlights(@RequestBody FlightSearchRequest request) {
        return ResponseEntity.ok(flightService.searchFlights(request));
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<FlightSearchResponse> getFlightDetails(@PathVariable Long flightId) {
        return ResponseEntity.ok(flightService.getFlightDetails(flightId));
    }

    @GetMapping("/{flightId}/seat-map")
    public ResponseEntity<List<Object>> getFlightSeatMap(@PathVariable Long flightId) {
        return ResponseEntity.ok(flightService.getFlightSeatMap(flightId));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<FlightSearchResponse>> getPopularFlights() {
        return ResponseEntity.ok(flightService.getPopularFlights());
    }

    @GetMapping("/deals")
    public ResponseEntity<List<FlightSearchResponse>> getFlightDeals() {
        return ResponseEntity.ok(flightService.getFlightDeals());
    }

    @GetMapping("/airlines")
    public ResponseEntity<List<Object>> getAirlines() {
        return ResponseEntity.ok(flightService.getAirlines());
    }

    @GetMapping("/airports")
    public ResponseEntity<List<Object>> getAirports() {
        return ResponseEntity.ok(flightService.getAirports());
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Object>> getFlightRoutes() {
        return ResponseEntity.ok(flightService.getFlightRoutes());
    }

    @GetMapping("/price-calendar")
    public ResponseEntity<List<Object>> getFlightPriceCalendar(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) String month) {
        return ResponseEntity.ok(flightService.getFlightPriceCalendar(from, to, month));
    }

    @GetMapping("/price-trends")
    public ResponseEntity<List<Object>> getFlightPriceTrends(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(flightService.getFlightPriceTrends(from, to));
    }

    @PostMapping("/alerts")
    public ResponseEntity<Void> subscribeFlightAlert(@RequestBody FlightAlertRequest request) {
        flightService.subscribeFlightAlert(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{flightId}/reviews")
    public ResponseEntity<List<Object>> getFlightReviews(@PathVariable Long flightId) {
        return ResponseEntity.ok(flightService.getFlightReviews(flightId));
    }

    @PostMapping("/{flightId}/reviews")
    public ResponseEntity<Void> submitFlightReview(
            @PathVariable Long flightId,
            @RequestBody FlightReviewRequest request) {
        flightService.submitFlightReview(flightId, request);
        return ResponseEntity.ok().build();
    }
}
