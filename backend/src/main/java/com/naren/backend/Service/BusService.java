package com.naren.backend.service;

import com.naren.backend.dto.*;
import com.naren.backend.entity.Schedule;
import com.naren.backend.repository.ScheduleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class BusService {

    private final ScheduleRepository scheduleRepository;
    private final ReviewService reviewService;
    private final PolicyService policyService;
    private final BusPhotoService busPhotoService;
    private final BoardingPointService boardingPointService;
    private final ObjectMapper objectMapper;

    private static final Map<String, Boolean> DEFAULT_AMENITIES = Map.of(
        "AC", true, "WiFi", true, "Charging Point", true, "Water Bottle", true
    );

    public List<BusResponse> getAllBuses() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .map(this::convertToBusResponse)
                .collect(Collectors.toList());
    }

    public List<BusResponse> searchBuses(String from, String to, String date) {
        List<Schedule> schedules = scheduleRepository.findAll();
        
        return schedules.stream()
                .filter(schedule -> {
                    boolean fromMatch = from == null || 
                        schedule.getRoute().getSource().getCity().equalsIgnoreCase(from);
                    
                    boolean toMatch = to == null || 
                        schedule.getRoute().getDestination().getCity().equalsIgnoreCase(to);
                    
                    boolean dateMatch = date == null || 
                        schedule.getDepartureTime().toLocalDate().toString().equals(date);
                    
                    return fromMatch && toMatch && dateMatch;
                })
                .map(this::convertToBusResponse)
                .collect(Collectors.toList());
    }

    private BusResponse convertToBusResponse(Schedule schedule) {
        String operator = schedule.getVehicle().getName();
        String from = schedule.getRoute().getSource().getName().split(" ")[0];
        if (from.isEmpty()) from = "Chennai";

        String to = schedule.getRoute().getDestination().getName().split(" ")[0];
        if (to.isEmpty()) to = "Bangalore";

        String date = "2026-04-11";
        String durationStr = formatDuration(schedule.getDepartureTime(), schedule.getArrivalTime());
        Double price = Math.round(schedule.getPrice() * 100.0) / 100.0;
        String busKind = schedule.getVehicle().getBusKind();
        List<String> peoplesChoice = parsePeoplesChoice(schedule.getVehicle().getPeoplesChoice(), operator, busKind);

        return new BusResponse(
            schedule.getVehicle().getId(),
            operator,
            from,
            to,
            date,
            schedule.getDepartureTime(),
            schedule.getArrivalTime(),
            durationStr,
            price,
            schedule.getVehicle().getType().toString(),
            schedule.getAvailableSeats(),
            schedule.getVehicle().getCapacity(),
            busKind,
            schedule.getVehicle().getRating(),
            schedule.getVehicle().getReviews(),
            peoplesChoice
        );
    }

    private String formatDuration(LocalDateTime departure, LocalDateTime arrival) {
        Duration duration = Duration.between(departure, arrival);
        return String.format("%dh %dm", duration.toHours(), duration.toMinutesPart());
    }

    private List<String> parsePeoplesChoice(String peoplesChoiceStr, String operator, String busKind) {
        if (peoplesChoiceStr != null && !peoplesChoiceStr.isEmpty()) {
            return Arrays.asList(peoplesChoiceStr.split(","));
        }

        String operatorLower = operator.toLowerCase();
        String busKindLower = busKind != null ? busKind.toLowerCase() : "";

        if (operatorLower.contains("volvo") || operatorLower.contains("scania")) {
            return List.of("Safety", "Comfort", "Luxury");
        } else if (operatorLower.contains("ksrtc") || operatorLower.contains("apsrtc")) {
            return List.of("Safety", "Punctuality", "Affordability");
        } else if (busKindLower.contains("sleeper")) {
            return List.of("Comfort", "Safety", "Cleanliness");
        } else if (busKindLower.contains("seater")) {
            return List.of("Value", "Punctuality", "Service");
        } else if (operatorLower.contains("express")) {
            return List.of("Speed", "Punctuality", "Efficiency");
        }

        List<String[]> choices = List.of(
            new String[]{"Safety", "Reliability"},
            new String[]{"Comfort", "Service"},
            new String[]{"Value", "Cleanliness"},
            new String[]{"Punctuality", "Efficiency"}
        );
        return Arrays.asList(choices.get(Math.abs(operator.hashCode()) % choices.size()));
    }

    public ExpandedBusResponse getExpandedBusDetails(String scheduleId) {
        log.info("Fetching expanded bus details for schedule: {}", scheduleId);
        
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found: " + scheduleId));
        
        String vehicleId = schedule.getVehicle().getId();
        
        // Get basic bus response data
        BusResponse basicResponse = convertToBusResponse(schedule);
        
        // Get expanded details
        Map<String, Boolean> amenities = parseAmenities(schedule.getVehicle().getAmenities());
        List<BusPhotoResponse> photos = busPhotoService.getPhotosByVehicle(vehicleId);
        List<BoardingPointResponse> boardingPoints = boardingPointService.getBoardingPoints();
        List<BoardingPointResponse> droppingPoints = boardingPointService.getDroppingPoints();
        List<ReviewResponse> recentReviews = reviewService.getReviewsByVehicle(vehicleId)
                .stream()
                .limit(4)
                .collect(Collectors.toList());
        ReviewsSummaryResponse reviewsSummary = reviewService.getReviewsSummary(vehicleId);
        List<PolicyResponse> policies = policyService.getPoliciesByVehicle(vehicleId);
        
        return new ExpandedBusResponse(
                schedule.getId(),
                basicResponse.operator(),
                basicResponse.from(),
                basicResponse.to(),
                basicResponse.date(),
                basicResponse.departure(),
                basicResponse.arrival(),
                basicResponse.duration(),
                basicResponse.price(),
                basicResponse.type(),
                basicResponse.seats(),
                basicResponse.totalSeats(),
                basicResponse.busKind(),
                basicResponse.rating(),
                basicResponse.reviews(),
                basicResponse.peoplesChoice(),
                amenities,
                photos,
                boardingPoints,
                droppingPoints,
                recentReviews,
                reviewsSummary,
                policies
        );
    }

    private Map<String, Boolean> parseAmenities(String amenitiesJson) {
        if (amenitiesJson == null || amenitiesJson.isEmpty()) {
            return new HashMap<>(DEFAULT_AMENITIES);
        }
        try {
            Map<String, Object> parsed = objectMapper.readValue(amenitiesJson, Map.class);
            Map<String, Boolean> amenities = new HashMap<>();
            for (Map.Entry<String, Object> entry : parsed.entrySet()) {
                if (entry.getValue() instanceof Boolean) {
                    amenities.put(entry.getKey(), (Boolean) entry.getValue());
                }
            }
            return amenities.isEmpty() ? new HashMap<>(DEFAULT_AMENITIES) : amenities;
        } catch (Exception e) {
            log.error("Error parsing amenities JSON: {}", e.getMessage());
            return new HashMap<>(DEFAULT_AMENITIES);
        }
    }
}
