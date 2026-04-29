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
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BusService.class);

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
        
        String date = "2026-04-11"; // Fixed date as requested
        
        LocalDateTime departure = schedule.getDepartureTime();
        LocalDateTime arrival = schedule.getArrivalTime();
        
        Duration duration = Duration.between(departure, arrival);
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        String durationStr = String.format("%dh %dm", hours, minutes);
        
        Double price = Math.round(schedule.getPrice() * 100.0) / 100.0;
        String type = schedule.getVehicle().getType().toString();
        Integer seats = schedule.getAvailableSeats();
        Integer totalSeats = schedule.getVehicle().getCapacity();
        String busKind = schedule.getVehicle().getBusKind();

        // Rating and reviews - use vehicle data or defaults
        Double rating = schedule.getVehicle().getRating();
        if (rating == null) {
            // Generate varied ratings based on operator characteristics
            int hash = Math.abs(operator.hashCode());
            if (operator.toLowerCase().contains("volvo") || operator.toLowerCase().contains("scania")) {
                rating = 4.5 + (hash % 10) * 0.05; // 4.5-4.95 for premium buses
            } else if (operator.toLowerCase().contains("ac")) {
                rating = 4.0 + (hash % 15) * 0.05; // 4.0-4.7 for AC buses
            } else {
                rating = 3.5 + (hash % 20) * 0.05; // 3.5-4.45 for others
            }
        }
        
        Integer reviews = schedule.getVehicle().getReviews();
        if (reviews == null) {
            // Generate varied review counts based on operator popularity
            int hash = Math.abs(operator.hashCode());
            if (operator.toLowerCase().contains("ksrtc") || operator.toLowerCase().contains("apsrtc")) {
                reviews = 2000 + (hash % 3000); // 2000-5000 for government operators
            } else if (operator.toLowerCase().contains("vrl") || operator.toLowerCase().contains("srs")) {
                reviews = 1500 + (hash % 2000); // 1500-3500 for popular private operators
            } else {
                reviews = 500 + (hash % 1500); // 500-2000 for others
            }
        }
        
        // People's choice - parse from vehicle data or generate varied sample
        List<String> peoplesChoice = List.of();
        String peoplesChoiceStr = schedule.getVehicle().getPeoplesChoice();
        if (peoplesChoiceStr != null && !peoplesChoiceStr.isEmpty()) {
            // Parse comma-separated values
            peoplesChoice = Arrays.asList(peoplesChoiceStr.split(","));
        } else {
            // Generate varied people's choice based on operator and bus type
            String operatorLower = operator.toLowerCase();
            String busKindLower = busKind != null ? busKind.toLowerCase() : "";
            
            if (operatorLower.contains("volvo") || operatorLower.contains("scania")) {
                peoplesChoice = Arrays.asList("Safety", "Comfort", "Luxury");
            } else if (operatorLower.contains("ksrtc") || operatorLower.contains("apsrtc")) {
                peoplesChoice = Arrays.asList("Safety", "Punctuality", "Affordability");
            } else if (busKindLower.contains("sleeper")) {
                peoplesChoice = Arrays.asList("Comfort", "Safety", "Cleanliness");
            } else if (busKindLower.contains("seater")) {
                peoplesChoice = Arrays.asList("Value", "Punctuality", "Service");
            } else if (operatorLower.contains("express")) {
                peoplesChoice = Arrays.asList("Speed", "Punctuality", "Efficiency");
            } else {
                // Random choices for other operators
                List<String[]> choices = Arrays.asList(
                    new String[]{"Safety", "Reliability"},
                    new String[]{"Comfort", "Service"},
                    new String[]{"Value", "Cleanliness"},
                    new String[]{"Punctuality", "Efficiency"}
                );
                int index = Math.abs(operator.hashCode()) % choices.size();
                peoplesChoice = Arrays.asList(choices.get(index));
            }
        }

        return new BusResponse(
            schedule.getVehicle().getId(),
            operator,
            from,
            to,
            date,
            departure,
            arrival,
            durationStr,
            price,
            type,
            seats,
            totalSeats,
            busKind,
            rating,
            reviews,
            peoplesChoice
        );
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
        Map<String, Boolean> amenities = new HashMap<>();
        if (amenitiesJson != null && !amenitiesJson.isEmpty()) {
            try {
                // Parse JSON string to Map
                Map<String, Object> parsed = objectMapper.readValue(amenitiesJson, Map.class);
                for (Map.Entry<String, Object> entry : parsed.entrySet()) {
                    if (entry.getValue() instanceof Boolean) {
                        amenities.put(entry.getKey(), (Boolean) entry.getValue());
                    }
                }
            } catch (Exception e) {
                log.error("Error parsing amenities JSON: {}", e.getMessage());
                // Fallback to default amenities
                amenities.put("AC", true);
                amenities.put("WiFi", true);
                amenities.put("Charging Point", true);
                amenities.put("Water Bottle", true);
            }
        } else {
            // Default amenities if none provided
            amenities.put("AC", true);
            amenities.put("WiFi", true);
            amenities.put("Charging Point", true);
            amenities.put("Water Bottle", true);
        }
        return amenities;
    }
}
