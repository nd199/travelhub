package com.naren.backend.service;

import com.naren.backend.dto.ReviewResponse;
import com.naren.backend.dto.ReviewsSummaryResponse;
import com.naren.backend.entity.Review;
import com.naren.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<ReviewResponse> getReviewsByVehicle(String vehicleId) {
        log.info("Fetching reviews for vehicle: {}", vehicleId);
        List<Review> reviews = reviewRepository.findByVehicleId(vehicleId);
        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReviewsSummaryResponse getReviewsSummary(String vehicleId) {
        log.info("Fetching reviews summary for vehicle: {}", vehicleId);

        List<Review> allReviews = reviewRepository.findByVehicleId(vehicleId);

        double totalRating = 0;
        long[] starCounts = new long[5];

        for (Review review : allReviews) {
            totalRating += review.getRating();
            if (review.getRating() >= 1 && review.getRating() <= 5) {
                starCounts[review.getRating() - 1]++;
            }
        }

        double averageRating = allReviews.isEmpty() ? 0.0 : totalRating / allReviews.size();

        return new ReviewsSummaryResponse(
                averageRating,
                (long) allReviews.size(),
                starCounts[4],
                starCounts[3],
                starCounts[2],
                starCounts[1],
                starCounts[0]
        );
    }

    private ReviewResponse convertToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getVehicle().getId(),
                review.getUserName(),
                review.getRating(),
                review.getComment(),
                review.getTravelDate(),
                review.getHelpfulCount(),
                review.getVerified(),
                review.getCreatedAt()
        );
    }
}
