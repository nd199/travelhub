package com.naren.backend.controller;

import com.naren.backend.record.TrainSearchRequest;
import com.naren.backend.record.TrainSearchResponse;
import com.naren.backend.record.TrainAlertRequest;
import com.naren.backend.record.TrainReviewRequest;
import com.naren.backend.service.TrainService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@Tag(name = "Trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<TrainSearchResponse>> searchTrains(@RequestBody TrainSearchRequest request) {
        return ResponseEntity.ok(trainService.searchTrains(request));
    }

    @GetMapping("/{trainId}")
    public ResponseEntity<TrainSearchResponse> getTrainDetails(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainDetails(trainId));
    }

    @GetMapping("/{trainId}/seat-map")
    public ResponseEntity<List<Object>> getTrainSeatMap(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainSeatMap(trainId));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<TrainSearchResponse>> getPopularTrains() {
        return ResponseEntity.ok(trainService.getPopularTrains());
    }

    @GetMapping("/deals")
    public ResponseEntity<List<TrainSearchResponse>> getTrainDeals() {
        return ResponseEntity.ok(trainService.getTrainDeals());
    }

    @GetMapping("/stations")
    public ResponseEntity<List<Object>> getTrainStations() {
        return ResponseEntity.ok(trainService.getTrainStations());
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Object>> getTrainRoutes() {
        return ResponseEntity.ok(trainService.getTrainRoutes());
    }

    @GetMapping("/{trainNumber}/schedule")
    public ResponseEntity<List<Object>> getTrainSchedule(
            @PathVariable String trainNumber,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(trainService.getTrainSchedule(trainNumber, date));
    }

    @GetMapping("/{trainNumber}/live-status")
    public ResponseEntity<Object> getTrainLiveStatus(@PathVariable String trainNumber) {
        return ResponseEntity.ok(trainService.getTrainLiveStatus(trainNumber));
    }

    @GetMapping("/price-calendar")
    public ResponseEntity<List<Object>> getTrainPriceCalendar(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(trainService.getTrainPriceCalendar(origin, destination, date));
    }

    @PostMapping("/alerts")
    public ResponseEntity<Void> subscribeTrainAlert(@RequestBody TrainAlertRequest request) {
        trainService.subscribeTrainAlert(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{trainId}/reviews")
    public ResponseEntity<List<Object>> getTrainReviews(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainReviews(trainId));
    }

    @PostMapping("/{trainId}/reviews")
    public ResponseEntity<Void> submitTrainReview(
            @PathVariable Long trainId,
            @RequestBody TrainReviewRequest request) {
        trainService.submitTrainReview(trainId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{trainId}/coach-layout")
    public ResponseEntity<List<Object>> getTrainCoachLayout(
            @PathVariable Long trainId,
            @RequestParam(defaultValue = "AC 3 Tier") String coach) {
        return ResponseEntity.ok(trainService.getTrainCoachLayout(trainId, coach));
    }

    @GetMapping("/{trainId}/amenities")
    public ResponseEntity<List<Object>> getTrainAmenities(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainAmenities(trainId));
    }

    @GetMapping("/{trainId}/pantry-menu")
    public ResponseEntity<List<Object>> getTrainPantryMenu(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainPantryMenu(trainId));
    }
}
