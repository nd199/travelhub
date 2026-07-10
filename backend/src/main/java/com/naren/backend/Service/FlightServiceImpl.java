package com.naren.backend.service;

import com.naren.backend.record.FlightSearchRequest;
import com.naren.backend.record.FlightSearchResponse;
import com.naren.backend.record.FlightAlertRequest;
import com.naren.backend.record.FlightReviewRequest;
import com.naren.backend.entity.*;
import com.naren.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlightServiceImpl implements FlightService {

    private final ScheduleRepository scheduleRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final LocationRepository locationRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public List<FlightSearchResponse> searchFlights(FlightSearchRequest request) {
        List<Schedule> schedules = scheduleRepository.findAll();

        return schedules.stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.FLIGHT)
                .filter(s -> request.origin() == null ||
                        s.getRoute().getSource().getCity().equalsIgnoreCase(request.origin()))
                .filter(s -> request.destination() == null ||
                        s.getRoute().getDestination().getCity().equalsIgnoreCase(request.destination()))
                .filter(s -> request.departureDate() == null ||
                        s.getDepartureTime().toLocalDate().equals(request.departureDate().toLocalDate()))
                .map(this::toFlightSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FlightSearchResponse getFlightDetails(Long flightId) {
        Schedule schedule = scheduleRepository.findById(String.valueOf(flightId))
                .orElseThrow(() -> new RuntimeException("Flight not found: " + flightId));
        return toFlightSearchResponse(schedule);
    }

    @Override
    public List<Object> getFlightSeatMap(Long flightId) {
        Schedule schedule = scheduleRepository.findById(String.valueOf(flightId))
                .orElseThrow(() -> new RuntimeException("Flight not found: " + flightId));
        List<Map<String, Object>> seatMap = new ArrayList<>();
        int totalSeats = schedule.getVehicle().getCapacity();
        for (int i = 1; i <= totalSeats; i++) {
            String row = String.valueOf((i - 1) / 6 + 1);
            char col = (char) ('A' + (i - 1) % 6);
            Map<String, Object> seat = new HashMap<>();
            seat.put("seatId", i);
            seat.put("seatNumber", row + col);
            seat.put("class", i <= totalSeats * 0.6 ? "Economy" : i <= totalSeats * 0.85 ? "Business" : "First");
            seat.put("status", "available");
            seat.put("price", i <= totalSeats * 0.6 ? 3200 : i <= totalSeats * 0.85 ? 8500 : 15000);
            seatMap.add(seat);
        }
        return seatMap.stream().map(s -> (Object) s).collect(Collectors.toList());
    }

    @Override
    public List<FlightSearchResponse> getPopularFlights() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.FLIGHT)
                .sorted((a, b) -> {
                    int aReviews = a.getVehicle().getReviews() != null ? a.getVehicle().getReviews() : 0;
                    int bReviews = b.getVehicle().getReviews() != null ? b.getVehicle().getReviews() : 0;
                    return Integer.compare(bReviews, aReviews);
                })
                .limit(10)
                .map(this::toFlightSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightSearchResponse> getFlightDeals() {
        return scheduleRepository.findAll().stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.FLIGHT)
                .sorted(Comparator.comparingDouble(Schedule::getPrice))
                .limit(5)
                .map(this::toFlightSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getAirlines() {
        return vehicleRepository.findByType(VehicleType.FLIGHT).stream()
                .map(vehicle -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", vehicle.getId());
                    map.put("name", vehicle.getName());
                    map.put("rating", vehicle.getRating());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getAirports() {
        return locationRepository.findByType(LocationType.AIRPORT).stream()
                .map(loc -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", loc.getId());
                    map.put("name", loc.getName());
                    map.put("city", loc.getCity());
                    map.put("state", loc.getState());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getFlightRoutes() {
        return routeRepository.findAll().stream()
                .filter(r -> r.getStatus() == RouteStatus.ACTIVE)
                .map(route -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("routeId", route.getId());
                    map.put("source", route.getSource().getCity());
                    map.put("destination", route.getDestination().getCity());
                    map.put("distance", route.getDistanceKm());
                    map.put("duration", route.getEstimatedDurationMinutes());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getFlightPriceCalendar(String origin, String destination, String date) {
        List<Map<String, Object>> calendar = new ArrayList<>();
        LocalDateTime startDate = date != null ? LocalDateTime.parse(date + "T00:00:00") : LocalDateTime.now();
        for (int i = 0; i < 30; i++) {
            LocalDateTime day = startDate.plusDays(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day.toLocalDate().toString());
            entry.put("economyPrice", 3000 + (i * 50));
            entry.put("businessPrice", 8000 + (i * 100));
            entry.put("availability", "Available");
            calendar.add(entry);
        }
        return calendar.stream().map(e -> (Object) e).collect(Collectors.toList());
    }

    @Override
    public List<Object> getFlightPriceTrends(String origin, String destination) {
        List<Map<String, Object>> trends = new ArrayList<>();
        for (int i = 30; i >= 0; i--) {
            LocalDateTime day = LocalDateTime.now().minusDays(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day.toLocalDate().toString());
            entry.put("price", 3200 + (int) (Math.sin(i * 0.3) * 500));
            entry.put("trend", i > 15 ? "up" : "down");
            trends.add(entry);
        }
        return trends.stream().map(e -> (Object) e).collect(Collectors.toList());
    }

    @Override
    public void subscribeFlightAlert(FlightAlertRequest request) {
        log.info("Flight alert subscription: {} to {}", request.origin(), request.destination());
    }

    @Override
    public List<Object> getFlightReviews(Long flightId) {
        Vehicle vehicle = vehicleRepository.findById(String.valueOf(flightId))
                .orElseThrow(() -> new RuntimeException("Flight not found: " + flightId));
        return reviewRepository.findByVehicleId(vehicle.getId()).stream()
                .map(review -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reviewId", review.getId());
                    map.put("userName", review.getUserName());
                    map.put("rating", review.getRating());
                    map.put("comment", review.getComment());
                    map.put("travelDate", review.getTravelDate() != null ? review.getTravelDate().toString() : null);
                    map.put("createdAt", review.getCreatedAt().toString());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void submitFlightReview(Long flightId, FlightReviewRequest request) {
        Vehicle vehicle = vehicleRepository.findById(String.valueOf(flightId))
                .orElseThrow(() -> new RuntimeException("Flight not found: " + flightId));
        Review review = Review.builder()
                .vehicle(vehicle)
                .userName(request.userId() != null ? request.userId() : "Anonymous")
                .rating(request.rating())
                .comment(request.comment())
                .travelDate(LocalDateTime.now())
                .build();
        reviewRepository.save(review);
        log.info("Review submitted for flight {}", flightId);
    }

    private FlightSearchResponse toFlightSearchResponse(Schedule schedule) {
        Vehicle vehicle = schedule.getVehicle();
        Route route = schedule.getRoute();
        Duration duration = Duration.between(schedule.getDepartureTime(), schedule.getArrivalTime());
        String durationStr = String.format("%dh %02dm", duration.toHours(), duration.toMinutesPart());

        return new FlightSearchResponse(
                schedule.getId(),
                vehicle.getRegistrationNumber(),
                route.getSource().getCity(),
                route.getDestination().getCity(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                vehicle.getName(),
                schedule.getPrice(),
                "Economy",
                schedule.getAvailableSeats(),
                List.of("AC", "Meals", "Entertainment")
        );
    }
}
