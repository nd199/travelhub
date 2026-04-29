package com.naren.backend.service;

import com.github.javafaker.Faker;
import com.naren.backend.entity.*;
import com.naren.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataSeedingService {

    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final BoardingPointRepository boardingPointRepository;
    private final ReviewRepository reviewRepository;
    private final PolicyRepository policyRepository;
    private final BusPhotoRepository busPhotoRepository;
    private final Faker faker = new Faker();
    private final Random random = new Random();
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataSeedingService.class);

    @Transactional
    public void seedAllData() {
        log.info("Starting data seeding process...");

        // Clear existing data
        seatRepository.deleteAll();
        scheduleRepository.deleteAll();
        routeRepository.deleteAll();
        vehicleRepository.deleteAll();
        locationRepository.deleteAll();

        // Seed locations
        List<Location> locations = seedLocations();

        // Seed vehicles
        List<Vehicle> vehicles = seedVehicles();

        // Seed routes
        List<Route> routes = seedRoutes(locations);

        // Seed schedules
        List<Schedule> schedules = seedSchedules(vehicles, routes);

        // Seed seats
        seedSeats(vehicles);

        // Seed boarding points
        seedBoardingPoints(locations);

        // Seed reviews
        seedReviews(vehicles);

        // Seed policies
        seedPolicies(vehicles);

        // Seed bus photos
        seedBusPhotos(vehicles);

        log.info("Data seeding completed successfully!");
    }

    @Transactional
    public void clearAllData() {
        log.info("Clearing all data...");

        busPhotoRepository.deleteAll();
        policyRepository.deleteAll();
        reviewRepository.deleteAll();
        boardingPointRepository.deleteAll();
        seatRepository.deleteAll();
        scheduleRepository.deleteAll();
        routeRepository.deleteAll();
        vehicleRepository.deleteAll();
        locationRepository.deleteAll();

        log.info("All data cleared successfully!");
    }

    private List<Location> seedLocations() {
        List<Location> locations = new ArrayList<>();

        String[] cities = {
                "Chennai Central", "Bangalore Majestic", "Hyderabad Central", "Mumbai Central", "Delhi ISBT",
                "Kolkata Esplanade", "Pune Swargate", "Jaipur Sindhi Camp", "Ahmedabad Geeta Mandir",
                "Kochi Vyttila", "Goa Panjim", "Coimbatore Gandhipuram", "Madurai Mattuthavani",
                "Trivandrum Central", "Vizag Dwaraka Nagar", "Mysore Suburban Bus Stand",
                "Chandigarh Sector 17", "Lucknow Charbagh", "Bhubaneswar Baramunda", "Ranchi Khadgarah"
        };

        String[] states = {
                "Tamil Nadu", "Karnataka", "Telangana", "Maharashtra", "Delhi",
                "West Bengal", "Maharashtra", "Rajasthan", "Gujarat", "Kerala",
                "Goa", "Tamil Nadu", "Tamil Nadu", "Kerala", "Andhra Pradesh",
                "Karnataka", "Chandigarh", "Uttar Pradesh", "Odisha", "Jharkhand"
        };

        for (int i = 0; i < cities.length; i++) {
            Location location = new Location();
            location.setId("loc" + String.format("%03d", i + 1));
            location.setName(cities[i]);
            location.setCity(cities[i].split(" ")[0]);
            location.setState(states[i]);
            location.setCountry("India");
            location.setLatitude(faker.number().randomDouble(8, 35, 8));
            location.setLongitude(faker.number().randomDouble(68, 97, 8));
            location.setType(LocationType.BUS_STOP);
            location.setAddress(faker.address().streetAddress());
            location.setPincode(faker.number().digits(6));

            locations.add(location);
        }

        List<Location> savedLocations = locationRepository.saveAll(locations);
        log.info("Seeded {} locations", savedLocations.size());
        return savedLocations;
    }

    private List<Vehicle> seedVehicles() {
        List<Vehicle> vehicles = new ArrayList<>();

        String[] busNames = {
                "KSRTC Volvo AC Sleeper", "SRS Travels AC Seater", "Orange Tours AC Seater",
                "APSRTC Non-AC Sleeper", "VRL Travels AC Sleeper", "IntrCity SmartBus AC Seater",
                "GreenLine Travels AC Seater", "Parveen Travels AC Seater", "Sharma Transports AC Sleeper",
                "National Travels AC Seater"
        };

        String[] busKinds = {
                "Electric A/C Seater (2+2)",
                "Bharat Benz A/C Seater /Sleeper (2+1)",
                "A/C Sleeper (2+1)",
                "Volvo A/C Multi-Axle Sleeper (2+1)",
                "Scania A/C Multi-Axle Semi-Sleeper (2+2)",
                "Ashok Leyland A/C Seater (2+2)",
                "Tata A/C Sleeper (2+1)",
                "Eicher A/C Seater (2+2)",
                "Mercedes Benz A/C Sleeper (2+1)",
                "Non-AC Seater (2+2)"
        };

        String[] amenities = {
                "{\"AC\": true, \"WiFi\": true, \"Charging Point\": true, \"Water Bottle\": true, \"Reading Light\": true, \"Blankets\": true, \"CCTV\": true}",
                "{\"AC\": true, \"WiFi\": true, \"Charging Point\": true, \"Water Bottle\": true, \"Snacks\": true}",
                "{\"AC\": true, \"WiFi\": true, \"Charging Point\": true, \"Water Bottle\": true, \"Snacks\": true, \"Entertainment\": true}",
                "{\"Water Bottle\": true, \"Reading Light\": true, \"Blankets\": true}",
                "{\"AC\": true, \"WiFi\": true, \"Charging Point\": true, \"CCTV\": true, \"Water Facility\": true, \"Emergency Exit\": true}",
                "{\"AC\": true, \"WiFi\": true, \"Charging Point\": true, \"Water Bottle\": true, \"Entertainment\": true, \"USB Charging\": true, \"CCTV\": true}"
        };

        for (int i = 0; i < busNames.length; i++) {
            Vehicle vehicle = new Vehicle();
            vehicle.setId("veh" + String.format("%03d", i + 1));
            vehicle.setName(busNames[i]);
            vehicle.setType(VehicleType.BUS);
            vehicle.setCapacity(faker.number().numberBetween(30, 50));
            vehicle.setAmenities(amenities[random.nextInt(amenities.length)]);
            vehicle.setBusKind(busKinds[i % busKinds.length]);
            vehicle.setStatus(VehicleStatus.ACTIVE);
            vehicle.setRegistrationNumber(faker.regexify("[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}"));

            vehicles.add(vehicle);
        }

        List<Vehicle> savedVehicles = vehicleRepository.saveAll(vehicles);
        log.info("Seeded {} vehicles", savedVehicles.size());
        return savedVehicles;
    }

    private List<Route> seedRoutes(List<Location> locations) {
        List<Route> routes = new ArrayList<>();

        // Create routes between major cities
        int[][] routePairs = {
                {0, 1}, {0, 2}, {1, 2}, {2, 3}, {3, 4},
                {4, 5}, {5, 6}, {6, 7}, {7, 8}, {8, 9},
                {9, 10}, {10, 11}, {11, 12}, {12, 13}, {13, 14},
                {14, 15}, {15, 16}, {16, 17}, {17, 18}, {18, 19}
        };

        for (int[] pair : routePairs) {
            // Check if locations exist and indices are valid
            if (pair[0] < locations.size() && pair[1] < locations.size()) {
                Location source = locations.get(pair[0]);
                Location destination = locations.get(pair[1]);
                
                Route route = new Route();
                route.setId("route" + String.format("%03d", routes.size() + 1));
                route.setSource(source);
                route.setDestination(destination);
                route.setDistanceKm(faker.number().randomDouble(300, 2000, 2));
                route.setEstimatedDurationMinutes(faker.number().numberBetween(240, 1440));
                route.setDescription(source.getCity() + " to " + destination.getCity() + " route");
                route.setStatus(RouteStatus.ACTIVE);

                routes.add(route);
            }
        }

        List<Route> savedRoutes = routeRepository.saveAll(routes);
        log.info("Seeded {} routes", savedRoutes.size());
        return savedRoutes;
    }

    private List<Schedule> seedSchedules(List<Vehicle> vehicles, List<Route> routes) {
        List<Schedule> schedules = new ArrayList<>();

        for (int i = 0; i < Math.min(vehicles.size(), routes.size()); i++) {
            // Check if vehicle and route exist
            if (i < vehicles.size() && i < routes.size()) {
                Vehicle vehicle = vehicles.get(i);
                Route route = routes.get(i);
                
                LocalDateTime departureTime = LocalDateTime.now()
                        .plusDays(random.nextInt(7))
                        .withHour(random.nextInt(24))
                        .withMinute(random.nextInt(60));

                LocalDateTime arrivalTime = departureTime
                        .plusHours(random.nextInt(12) + 1)
                        .plusMinutes(random.nextInt(60));

                Schedule schedule = new Schedule();
                schedule.setId("sched" + String.format("%03d", i + 1));
                schedule.setVehicle(vehicle);
                schedule.setRoute(route);
                schedule.setDepartureTime(departureTime);
                schedule.setArrivalTime(arrivalTime);
                schedule.setPrice((double) faker.number().numberBetween(300, 2000));
                schedule.setAvailableSeats(vehicle.getCapacity());
                schedule.setStatus(ScheduleStatus.ACTIVE);

                schedules.add(schedule);
            }
        }

        List<Schedule> savedSchedules = scheduleRepository.saveAll(schedules);
        log.info("Seeded {} schedules", savedSchedules.size());
        return savedSchedules;
    }

    private void seedSeats(List<Vehicle> vehicles) {
        List<Seat> seats = new ArrayList<>();
        String[] seatTypes = {"WINDOW", "AISLE"};
        SeatStatus[] seatStatuses = {SeatStatus.AVAILABLE, SeatStatus.BOOKED};

        for (Vehicle vehicle : vehicles) {
            int capacity = vehicle.getCapacity();
            int rows = capacity / 4; // Assuming 4 seats per row (2 windows, 2 aisles)

            for (int row = 1; row <= rows; row++) {
                for (int col = 0; col < 4; col++) {
                    String seatNumber;
                    String seatType;

                    switch (col) {
                        case 0, 3 -> {
                            seatType = "WINDOW";
                            seatNumber = row + String.valueOf((char) ('A' + col));
                        }
                        case 1, 2 -> {
                            seatType = "AISLE";
                            seatNumber = row + String.valueOf((char) ('A' + col));
                        }
                        default -> {
                            seatType = "AISLE";
                            seatNumber = row + String.valueOf((char) ('A' + col));
                        }
                    }

                    Seat seat = new Seat();
                    seat.setId("seat" + String.format("%03d", seats.size() + 1));
                    seat.setVehicle(vehicle);
                    seat.setSeatNumber(seatNumber);
                    seat.setType(seatType);
                    seat.setStatus(seatStatuses[random.nextInt(seatStatuses.length)]);
                    seat.setPrice(faker.number().randomDouble(300, 1000, 2));

                    seats.add(seat);
                }
            }
        }

        List<Seat> savedSeats = seatRepository.saveAll(seats);
        log.info("Seeded {} seats", savedSeats.size());
    }

    private void seedBoardingPoints(List<Location> locations) {
        List<BoardingPoint> boardingPoints = new ArrayList<>();

        // Sample boarding points data
        String[][] boardingData = {
                {"Koyambedu Omni Bus Stand", "Omni Bus Stand Entrance", "23:00", "Near main entrance"},
                {"Maduravoyal Vasanta Bhavan", "Vasanta Bhavan Hotel Opp MGR University", "23:15", "Hotel entrance"},
                {"Erikarai Bus Stop", "Erikarai Bus Stop", "23:20", "Main road"},
                {"Velappanchavadi", "Velappanchavadi arch", "23:35", "Near arch"},
                {"Poonamalle", "Near Bus Stop", "23:55", "Main junction"},
                {"Sri Perumbudur", "Toll plaza", "00:15", "Toll plaza entrance"}
        };

        String[][] droppingData = {
                {"Attibele Toll", "Attibele Toll PLAZA", "05:15", "Toll plaza"},
                {"Bommasandra", "Opp to A2B hotel bus stop", "05:30", "Near hotel"},
                {"Electronic city Tollgate", "NEAR Electronic city Tollgate", "05:40", "Tollgate"},
                {"Silk Board", "Silk Board Junction", "05:46", "Main junction"},
                {"BTM Layout", "BTM 2nd Stage", "05:55", "2nd Stage area"},
                {"Madiwala", "Near Bus Stop", "06:00", "Bus stop area"},
                {"Koramangala", "6th Block", "06:10", "6th Block"},
                {"Majestic Bus Stand", "Bangalore Central", "06:30", "Central area"}
        };

        // Add boarding points for first few locations
        for (int i = 0; i < Math.min(boardingData.length, locations.size() / 2); i++) {
            for (int j = 0; j < boardingData[i].length; j++) {
                Location location = locations.get(i * 2); // Use even indices for boarding
                BoardingPoint boardingPoint = new BoardingPoint();
                boardingPoint.setId("bp" + String.format("%03d", boardingPoints.size() + 1));
                boardingPoint.setLocation(location);
                boardingPoint.setPointName(boardingData[i][0]);
                boardingPoint.setAddress(boardingData[i][1]);
                boardingPoint.setTime(boardingData[i][2]);
                boardingPoint.setLandmark(boardingData[i][3]);
                boardingPoint.setType(BoardingPointType.BOARDING);
                boardingPoints.add(boardingPoint);
            }
        }

        // Add dropping points for next few locations
        for (int i = 0; i < Math.min(droppingData.length, locations.size() / 2); i++) {
            Location location = locations.get(i * 2 + 1); // Use odd indices for dropping
            BoardingPoint droppingPoint = new BoardingPoint();
            droppingPoint.setId("dp" + String.format("%03d", boardingPoints.size() + 1));
            droppingPoint.setLocation(location);
            droppingPoint.setPointName(droppingData[i][0]);
            droppingPoint.setAddress(droppingData[i][1]);
            droppingPoint.setTime(droppingData[i][2]);
            droppingPoint.setLandmark(droppingData[i][3]);
            droppingPoint.setType(BoardingPointType.DROPPING);
            boardingPoints.add(droppingPoint);
        }

        List<BoardingPoint> savedBoardingPoints = boardingPointRepository.saveAll(boardingPoints);
        log.info("Seeded {} boarding points", savedBoardingPoints.size());
    }

    private void seedReviews(List<Vehicle> vehicles) {
        List<Review> reviews = new ArrayList<>();

        String[] userNames = {"Rahul S.", "Priya M.", "Amit K.", "Sneha R.", "Vikram T.", "Anjali N.", "Rohit P.", "Kavya L."};
        String[] comments = {
                "Excellent journey! The bus was clean, AC worked perfectly, and the staff was very helpful.",
                "Good experience overall. The seats were comfortable and the ride was smooth.",
                "Best bus service I've experienced. On time departure and arrival. Highly recommended!",
                "Nice journey with comfortable seating. Could improve the snack options.",
                "Very professional service. Clean bus and punctual schedule.",
                "Comfortable journey with good amenities. Staff was cooperative.",
                "Great value for money. Bus was well-maintained and punctual.",
                "Pleasant travel experience. Would definitely book again."
        };

        for (Vehicle vehicle : vehicles) {
            int reviewCount = faker.number().numberBetween(3, 8);
            for (int i = 0; i < reviewCount; i++) {
                Review review = new Review();
                review.setId("rev" + String.format("%03d", reviews.size() + 1));
                review.setVehicle(vehicle);
                review.setUserName(userNames[random.nextInt(userNames.length)]);
                review.setRating(random.nextInt(2) + 4); // Ratings between 4-5
                review.setComment(comments[random.nextInt(comments.length)]);
                review.setTravelDate(LocalDateTime.now().minusDays(random.nextInt(30)));
                review.setHelpfulCount(random.nextInt(20));
                review.setVerified(random.nextBoolean());
                reviews.add(review);
            }
        }

        List<Review> savedReviews = reviewRepository.saveAll(reviews);
        log.info("Seeded {} reviews", savedReviews.size());
    }

    private void seedPolicies(List<Vehicle> vehicles) {
        List<Policy> policies = new ArrayList<>();

        String[][] policyData = {
                {"Cancellation Policy", "Free cancellation up to 4 hours before departure", "50% refund up to 1 hour before departure\nNo refund after departure time\nFree rescheduling up to 2 hours before departure", "Clock"},
                {"Baggage Policy", "Carry-on and check-in baggage guidelines", "1 carry-on bag up to 7kg allowed\n1 check-in bag up to 15kg allowed\nExtra baggage charges applicable\nProhibited items: flammable materials", "XCircle"},
                {"Refund Policy", "Refund processing timeline and conditions", "Refunds processed within 5-7 working days\nOriginal payment method will be used\nBank charges may apply\nRefund confirmation via email/SMS", "RefreshCw"},
                {"Travel Guidelines", "Important travel information", "Photo ID mandatory for travel\nArrive 15 minutes before departure\nCOVID-19 guidelines must be followed\nEmergency contact number required", "Clock"}
        };

        for (Vehicle vehicle : vehicles) {
            for (String[] policyInfo : policyData) {
                Policy policy = new Policy();
                policy.setId("pol" + String.format("%03d", policies.size() + 1));
                policy.setVehicle(vehicle);
                policy.setTitle(policyInfo[0]);
                policy.setDescription(policyInfo[1]);
                policy.setRules(policyInfo[2]);
                policy.setIcon(policyInfo[3]);
                policy.setPolicyType(policyInfo[0].toLowerCase().replace(" ", "_"));
                policies.add(policy);
            }
        }

        List<Policy> savedPolicies = policyRepository.saveAll(policies);
        log.info("Seeded {} policies", savedPolicies.size());
    }

    private void seedBusPhotos(List<Vehicle> vehicles) {
        List<BusPhoto> busPhotos = new ArrayList<>();

        String[] photoTypes = {"Exterior", "Seater", "Charging-Sockets", "AC and Reading Lights", "RestRoom", "Driver Cabin", "Interior View", "Luggage Space"};
        
        // Sample photo URLs (using placeholder images)
        String[] photoUrls = {
                "https://images.unsplash.com/photo-1544620394-9a8927622199?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1580677525341-3c89b9c8e5db?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1542362567-b07e5e58a6ea?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop"
        };

        for (Vehicle vehicle : vehicles) {
            for (int i = 0; i < Math.min(photoTypes.length, photoUrls.length); i++) {
                BusPhoto busPhoto = new BusPhoto();
                busPhoto.setId("photo" + String.format("%03d", busPhotos.size() + 1));
                busPhoto.setVehicle(vehicle);
                busPhoto.setPhotoUrl(photoUrls[i]);
                busPhoto.setCaption(photoTypes[i] + " view of " + vehicle.getName());
                busPhoto.setPhotoType(photoTypes[i]);
                busPhoto.setDisplayOrder(i);
                busPhoto.setIsPrimary(i == 0);
                busPhotos.add(busPhoto);
            }
        }

        List<BusPhoto> savedBusPhotos = busPhotoRepository.saveAll(busPhotos);
        log.info("Seeded {} bus photos", savedBusPhotos.size());
    }
}
