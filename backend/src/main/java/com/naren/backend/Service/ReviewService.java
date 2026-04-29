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
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ReviewService.class);

    public List<ReviewResponse> getReviewsByVehicle(String vehicleId) {
        log.info("Fetching reviews for vehicle: {}", vehicleId);
        List<Review> reviews = reviewRepository.findByVehicleId(vehicleId);
        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReviewsSummaryResponse getReviewsSummary(String vehicleId) {
        log.info("Fetching reviews summary for vehicle: {}", vehicleId);
        
        Double averageRating = reviewRepository.findAverageRatingByVehicleId(vehicleId);
        Long totalReviews = reviewRepository.countReviewsByVehicleId(vehicleId);
        
        if (averageRating == null) {
            averageRating = 0.0;
        }
        if (totalReviews == null) {
            totalReviews = 0L;
        }

        List<Review> allReviews = reviewRepository.findByVehicleId(vehicleId);
        long fiveStar = allReviews.stream().filter(r -> r.getRating() == 5).count();
        long fourStar = allReviews.stream().filter(r -> r.getRating() == 4).count();
        long threeStar = allReviews.stream().filter(r -> r.getRating() == 3).count();
        long twoStar = allReviews.stream().filter(r -> r.getRating() == 2).count();
        long oneStar = allReviews.stream().filter(r -> r.getRating() == 1).count();

        return new ReviewsSummaryResponse(
                averageRating,
                totalReviews,
                fiveStar,
                fourStar,
                threeStar,
                twoStar,
                oneStar
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
