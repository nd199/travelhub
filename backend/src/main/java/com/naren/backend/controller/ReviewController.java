package com.naren.backend.controller;

import com.naren.backend.dto.ReviewResponse;
import com.naren.backend.dto.ReviewsSummaryResponse;
import com.naren.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByVehicle(@PathVariable String vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicle(vehicleId));
    }

    @GetMapping("/vehicle/{vehicleId}/summary")
    public ResponseEntity<ReviewsSummaryResponse> getReviewsSummary(@PathVariable String vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsSummary(vehicleId));
    }
}
