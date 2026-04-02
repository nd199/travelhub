package com.naren.backend.config;

import com.github.javafaker.Faker;
import com.naren.backend.entity.*;
import com.naren.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final SeatRepository seatRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;

    private final Faker faker = new Faker();

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            log.info("Seeding database with fake data...");
            seedRoles();
            seedLocations();
            seedVehicles();
            seedUsers();
            seedRoutes();
            seedSchedules();
            seedBookings();
        }
    }

    private void seedRoles() {
        List<Role> roles = Arrays.asList(
                Role.builder().name("ADMIN").description("System Administrator").build(),
                Role.builder().name("CUSTOMER").description("Regular Customer").build(),
                Role.builder().name("OPERATOR").description("Transport Operator").build()
        );
        roleRepository.saveAll(roles);
    }

    private void seedLocations() {
        List<Location> locations = new ArrayList<>();

        String[] cities = {"Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"};
        String[] states = {"Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh"};

        for (int i = 0; i < 10; i++) {
            Location location = Location.builder()
                    .name(faker.company().name() + " Terminal")
                    .city(cities[i])
                    .state(states[i])
                    .country("India")
                    .latitude(Double.valueOf(faker.address().latitude()))
                    .longitude(Double.valueOf(faker.address().longitude()))
                    .type(i % 2 == 0 ? LocationType.BUS_STOP : LocationType.AIRPORT)
                    .address(faker.address().fullAddress())
                    .pincode(faker.address().zipCode())
                    .build();
            locations.add(location);
        }
        locationRepository.saveAll(locations);
    }

    private void seedVehicles() {
        List<Vehicle> vehicles = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            Vehicle vehicle = Vehicle.builder()
                    .name(faker.company().name() + " " + (i % 2 == 0 ? "Bus" : "Coach"))
                    .type(i % 2 == 0 ? VehicleType.BUS : VehicleType.MINI_BUS)
                    .capacity(faker.number().numberBetween(20, 50))
                    .amenities("AC, WiFi, Charging Points")
                    .status(VehicleStatus.ACTIVE)
                    .registrationNumber(faker.regexify("[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}"))
                    .build();
            vehicles.add(vehicle);
        }
        vehicleRepository.saveAll(vehicles);

        List<Seat> allSeats = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            for (int i = 1; i <= vehicle.getCapacity(); i++) {
                Seat seat = Seat.builder()
                        .vehicle(vehicle)
                        .seatNumber(String.valueOf(i))
                        .type(i % 4 == 0 ? "Sleeper" : "Seater")
                        .status(SeatStatus.AVAILABLE)
                        .price(faker.number().randomDouble(2, 500, 2000))
                        .build();
                allSeats.add(seat);
            }
        }
        seatRepository.saveAll(allSeats);
    }

    private void seedUsers() {
        List<Role> roles = roleRepository.findAll();
        Role customerRole = roles.stream().filter(r -> r.getName().equals("CUSTOMER")).findFirst().orElse(roles.get(1));
        Role adminRole = roles.stream().filter(r -> r.getName().equals("ADMIN")).findFirst().orElse(roles.get(0));

        List<Users> users = new ArrayList<>();

        Users admin = Users.builder()
                .email("admin@travelhub.com")
                .password("admin123")
                .firstName("Admin")
                .lastName("User")
                .phoneNumber(faker.phoneNumber().cellPhone())
                .gender(Gender.MALE)
                .role(adminRole)
                .build();
        users.add(admin);

        for (int i = 0; i < 10; i++) {
            Users user = Users.builder()
                    .email(faker.internet().emailAddress())
                    .password(faker.internet().password(8, 16))
                    .firstName(faker.name().firstName())
                    .lastName(faker.name().lastName())
                    .phoneNumber(faker.phoneNumber().cellPhone())
                    .gender(faker.random().nextBoolean() ? Gender.MALE : Gender.FEMALE)
                    .role(customerRole)
                    .build();
            users.add(user);
        }
        userRepository.saveAll(users);
    }

    private void seedRoutes() {
        List<Location> locations = locationRepository.findAll();
        List<Route> routes = new ArrayList<>();

        for (int i = 0; i < locations.size() - 1; i++) {
            Route route = Route.builder()
                    .source(locations.get(i))
                    .destination(locations.get(i + 1))
                    .distanceKm(faker.number().randomDouble(2, 100, 1500))
                    .estimatedDurationMinutes(faker.number().numberBetween(120, 720))
                    .description("Route from " + locations.get(i).getCity() + " to " + locations.get(i + 1).getCity())
                    .status(RouteStatus.ACTIVE)
                    .build();
            routes.add(route);
        }
        routeRepository.saveAll(routes);
    }

    private void seedSchedules() {
        List<Route> routes = routeRepository.findAll();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Schedule> schedules = new ArrayList<>();

        for (Route route : routes) {
            for (int i = 0; i < 3; i++) {
                LocalDateTime departure = LocalDateTime.now().plusDays(faker.number().numberBetween(1, 30))
                        .withHour(faker.number().numberBetween(6, 22))
                        .withMinute(faker.random().nextBoolean() ? 0 : 30);
                LocalDateTime arrival = departure.plusMinutes(route.getEstimatedDurationMinutes() != null ? route.getEstimatedDurationMinutes() : 360);

                Schedule schedule = Schedule.builder()
                        .vehicle(vehicles.get(faker.number().numberBetween(0, vehicles.size())))
                        .route(route)
                        .departureTime(departure)
                        .arrivalTime(arrival)
                        .price(faker.number().randomDouble(2, 500, 3000))
                        .availableSeats(faker.number().numberBetween(10, 40))
                        .status(ScheduleStatus.SCHEDULED)
                        .build();
                schedules.add(schedule);
            }
        }
        scheduleRepository.saveAll(schedules);
    }

    private void seedBookings() {
        List<Users> users = userRepository.findAll();
        List<Schedule> schedules = scheduleRepository.findAll();
        List<Seat> seats = seatRepository.findAll();

        List<Booking> bookings = new ArrayList<>();
        List<BookingSeat> bookingSeats = new ArrayList<>();
        List<Passenger> passengers = new ArrayList<>();
        List<Payment> payments = new ArrayList<>();
        List<Transaction> transactions = new ArrayList<>();

        for (int i = 0; i < 15; i++) {
            Users user = users.get(faker.number().numberBetween(0, users.size()));
            Schedule schedule = schedules.get(faker.number().numberBetween(0, schedules.size()));

            Booking booking = Booking.builder()
                    .bookingReference("BK" + faker.regexify("[A-Z0-9]{8}"))
                    .user(user)
                    .schedule(schedule)
                    .travelDate(schedule.getDepartureTime())
                    .status(faker.random().nextBoolean() ? BookingStatus.CONFIRMED : BookingStatus.PENDING)
                    .totalAmount(faker.number().randomDouble(2, 500, 5000))
                    .discountAmount(faker.number().randomDouble(2, 0, 200))
                    .taxAmount(faker.number().randomDouble(2, 50, 500))
                    .finalAmount(faker.number().randomDouble(2, 500, 5000))
                    .build();
            bookings.add(booking);

            int passengerCount = faker.number().numberBetween(1, 4);
            for (int j = 0; j < passengerCount; j++) {
                Passenger passenger = Passenger.builder()
                        .booking(booking)
                        .seat(seats.get(faker.number().numberBetween(0, seats.size())))
                        .name(faker.name().fullName())
                        .age(faker.number().numberBetween(18, 70))
                        .gender(faker.random().nextBoolean() ? Gender.MALE : Gender.FEMALE)
                        .contactNumber(faker.phoneNumber().cellPhone())
                        .email(faker.internet().emailAddress())
                        .idProofType(faker.random().nextBoolean() ? "Aadhar" : "PAN")
                        .idProofNumber(faker.regexify("[A-Z0-9]{12}"))
                        .build();
                passengers.add(passenger);
            }

            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getFinalAmount())
                    .currency("INR")
                    .status(booking.getStatus() == BookingStatus.CONFIRMED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING)
                    .method(faker.options().option("Credit Card", "Debit Card", "UPI", "Net Banking"))
                    .transactionReference("TXN" + faker.regexify("[A-Z0-9]{10}"))
                    .gatewayTransactionId(faker.regexify("[A-Z0-9]{16}"))
                    .gatewayResponse("Success")
                    .build();
            payments.add(payment);

            Transaction transaction = Transaction.builder()
                    .payment(payment)
                    .transactionReference("TRX" + faker.regexify("[A-Z0-9]{12}"))
                    .amount(payment.getAmount())
                    .currency("INR")
                    .gatewayName(faker.options().option("Razorpay", "PayU", "Paytm"))
                    .gatewayTransactionId(payment.getGatewayTransactionId())
                    .gatewayResponse("{\"status\":\"success\",\"message\":\"Payment successful\"}")
                    .status(payment.getStatus())
                    .build();
            transactions.add(transaction);
        }

        bookingRepository.saveAll(bookings);
        passengerRepository.saveAll(passengers);
        paymentRepository.saveAll(payments);
        transactionRepository.saveAll(transactions);
    }
}
