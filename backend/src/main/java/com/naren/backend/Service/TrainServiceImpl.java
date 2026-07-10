package com.naren.backend.service;

import com.naren.backend.record.TrainSearchRequest;
import com.naren.backend.record.TrainSearchResponse;
import com.naren.backend.record.TrainAlertRequest;
import com.naren.backend.record.TrainReviewRequest;
import com.naren.backend.entity.*;
import com.naren.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainServiceImpl implements TrainService {

    private final ScheduleRepository scheduleRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final LocationRepository locationRepository;
    private final ReviewRepository reviewRepository;
    private final SeatRepository seatRepository;

    @Override
    public List<TrainSearchResponse> searchTrains(TrainSearchRequest request) {
        List<Schedule> schedules = scheduleRepository.findAll();

        return schedules.stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.TRAIN)
                .filter(s -> request.origin() == null ||
                        s.getRoute().getSource().getCity().equalsIgnoreCase(request.origin()))
                .filter(s -> request.destination() == null ||
                        s.getRoute().getDestination().getCity().equalsIgnoreCase(request.destination()))
                .filter(s -> request.departureDate() == null ||
                        s.getDepartureTime().toLocalDate().equals(request.departureDate().toLocalDate()))
                .map(this::toTrainSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TrainSearchResponse getTrainDetails(Long trainId) {
        Schedule schedule = scheduleRepository.findById(String.valueOf(trainId))
                .orElseThrow(() -> new RuntimeException("Train not found: " + trainId));
        return toTrainSearchResponse(schedule);
    }

    @Override
    public List<Object> getTrainSeatMap(Long trainId) {
        Vehicle vehicle = vehicleRepository.findById(String.valueOf(trainId))
                .orElseThrow(() -> new RuntimeException("Train not found: " + trainId));
        List<Seat> seats = seatRepository.findByVehicleId(vehicle.getId());
        return seats.stream()
                .map(seat -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("seatId", seat.getId());
                    map.put("seatNumber", seat.getSeatNumber());
                    map.put("status", seat.getStatus().toString());
                    map.put("type", seat.getType());
                    map.put("price", seat.getPrice());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TrainSearchResponse> getPopularTrains() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.TRAIN)
                .sorted((a, b) -> {
                    int aReviews = a.getVehicle().getReviews() != null ? a.getVehicle().getReviews() : 0;
                    int bReviews = b.getVehicle().getReviews() != null ? b.getVehicle().getReviews() : 0;
                    return Integer.compare(bReviews, aReviews);
                })
                .limit(10)
                .map(this::toTrainSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TrainSearchResponse> getTrainDeals() {
        return scheduleRepository.findAll().stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.TRAIN)
                .sorted(Comparator.comparingDouble(Schedule::getPrice))
                .limit(5)
                .map(this::toTrainSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getTrainStations() {
        return locationRepository.findByType(LocationType.STATION).stream()
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
    public List<Object> getTrainRoutes() {
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
    public List<Object> getTrainSchedule(String trainNumber, String date) {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .filter(s -> s.getVehicle().getType() == VehicleType.TRAIN)
                .filter(s -> s.getVehicle().getRegistrationNumber() != null &&
                        s.getVehicle().getRegistrationNumber().equals(trainNumber))
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("scheduleId", s.getId());
                    map.put("departureTime", s.getDepartureTime().toString());
                    map.put("arrivalTime", s.getArrivalTime().toString());
                    map.put("price", s.getPrice());
                    map.put("availableSeats", s.getAvailableSeats());
                    map.put("status", s.getStatus().toString());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Object getTrainLiveStatus(String trainNumber) {
        Map<String, Object> status = new HashMap<>();
        status.put("trainNumber", trainNumber);
        status.put("currentStation", "Bangalore City");
        status.put("delay", 0);
        status.put("status", "On Time");
        status.put("lastUpdated", LocalDateTime.now().toString());
        status.put("nextStation", "Krishnarajapuram");
        return status;
    }

    @Override
    public List<Object> getTrainPriceCalendar(String origin, String destination, String date) {
        List<Map<String, Object>> calendar = new ArrayList<>();
        LocalDateTime startDate = date != null ? LocalDateTime.parse(date + "T00:00:00") : LocalDateTime.now();
        for (int i = 0; i < 30; i++) {
            LocalDateTime day = startDate.plusDays(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day.toLocalDate().toString());
            entry.put("price", 400 + (i * 10));
            entry.put("availability", "Available");
            calendar.add(entry);
        }
        return calendar.stream().map(e -> (Object) e).collect(Collectors.toList());
    }

    @Override
    public void subscribeTrainAlert(TrainAlertRequest request) {
        log.info("Train alert subscription: {} to {}", request.origin(), request.destination());
    }

    @Override
    public List<Object> getTrainReviews(Long trainId) {
        Vehicle vehicle = vehicleRepository.findById(String.valueOf(trainId))
                .orElseThrow(() -> new RuntimeException("Train not found: " + trainId));
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
    public void submitTrainReview(Long trainId, TrainReviewRequest request) {
        Vehicle vehicle = vehicleRepository.findById(String.valueOf(trainId))
                .orElseThrow(() -> new RuntimeException("Train not found: " + trainId));
        Review review = Review.builder()
                .vehicle(vehicle)
                .userName(request.userId() != null ? request.userId() : "Anonymous")
                .rating(request.rating())
                .comment(request.comment())
                .travelDate(LocalDateTime.now())
                .build();
        reviewRepository.save(review);
        log.info("Review submitted for train {}", trainId);
    }

    @Override
    public List<Object> getTrainCoachLayout(Long trainId, String coachClass) {
        List<Map<String, Object>> layout = new ArrayList<>();
        for (int i = 1; i <= 9; i++) {
            Map<String, Object> bay = new HashMap<>();
            bay.put("bayNumber", i);
            bay.put("seats", List.of(
                    Map.of("number", (i - 1) * 8 + 1, "type", "LB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 2, "type", "MB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 3, "type", "UB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 4, "type", "LB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 5, "type", "MB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 6, "type", "UB", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 7, "type", "SL", "status", "available"),
                    Map.of("number", (i - 1) * 8 + 8, "type", "SU", "status", "available")
            ));
            layout.add(bay);
        }
        return layout.stream().map(e -> (Object) e).collect(Collectors.toList());
    }

    @Override
    public List<Object> getTrainAmenities(Long trainId) {
        return List.of(
                Map.of("name", "AC", "available", true),
                Map.of("name", "WiFi", "available", true),
                Map.of("name", "Charging Point", "available", true),
                Map.of("name", "Bedrolls", "available", true),
                Map.of("name", "Pantry", "available", true),
                Map.of("name", "Reading Light", "available", true)
        );
    }

    @Override
    public List<Object> getTrainPantryMenu(Long trainId) {
        return List.of(
                Map.of("category", "Meals", "items", List.of(
                        Map.of("name", "Veg Thali", "price", 150),
                        Map.of("name", "Non-Veg Thali", "price", 200),
                        Map.of("name", "Curd Rice", "price", 80)
                )),
                Map.of("category", "Snacks", "items", List.of(
                        Map.of("name", "Samosa", "price", 30),
                        Map.of("name", "Pakoda", "price", 40),
                        Map.of("name", "Bread Pakoda", "price", 35)
                )),
                Map.of("category", "Beverages", "items", List.of(
                        Map.of("name", "Tea", "price", 15),
                        Map.of("name", "Coffee", "price", 20),
                        Map.of("name", "Water Bottle", "price", 20)
                ))
        );
    }

    private TrainSearchResponse toTrainSearchResponse(Schedule schedule) {
        Vehicle vehicle = schedule.getVehicle();
        Route route = schedule.getRoute();
        Duration duration = Duration.between(schedule.getDepartureTime(), schedule.getArrivalTime());
        String durationStr = String.format("%dh %02dm", duration.toHours(), duration.toMinutesPart());

        return new TrainSearchResponse(
                schedule.getId(),
                vehicle.getRegistrationNumber(),
                route.getSource().getCity(),
                route.getDestination().getCity(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                vehicle.getName(),
                schedule.getPrice(),
                "All Class",
                schedule.getAvailableSeats(),
                List.of("AC", "WiFi", "Charging Point")
        );
    }
}
