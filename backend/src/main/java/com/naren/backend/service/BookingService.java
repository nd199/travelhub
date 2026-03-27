package com.naren.backend.service;

import com.naren.backend.entity.Booking;
import com.naren.backend.entity.Passenger;
import com.naren.backend.entity.Route;
import com.naren.backend.entity.User;
import com.naren.backend.repository.BookingRepository;
import com.naren.backend.repository.PassengerRepository;
import com.naren.backend.repository.RouteRepository;
import com.naren.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;
    private final PassengerRepository passengerRepository;
    private final VehicleService vehicleService;

    public Booking createBooking(Long userId, Long routeId, List<Passenger> passengers) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + routeId));

        if (!route.getActive()) {
            throw new RuntimeException("Route is not active");
        }

        // Check seat availability
        if (route.getVehicle().getAvailableSeats() < passengers.size()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setNumberOfPassengers(passengers.size());
        booking.setTotalAmount(route.getPrice().multiply(BigDecimal.valueOf(passengers.size())));
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setBookingDate(LocalDateTime.now());
        booking.setUser(user);
        booking.setRoute(route);
        booking.setVehicle(route.getVehicle());

        Booking savedBooking = bookingRepository.save(booking);

        // Save passengers
        for (Passenger passenger : passengers) {
            passenger.setBooking(savedBooking);
            passengerRepository.save(passenger);
        }

        // Update available seats
        vehicleService.updateAvailableSeats(route.getVehicle().getId(), passengers.size());

        return savedBooking;
    }

    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        // Release seats
        vehicleService.releaseSeats(booking.getVehicle().getId(), booking.getNumberOfPassengers());

        return bookingRepository.save(booking);
    }

    public Booking rescheduleBooking(Long bookingId, Long newRouteId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be rescheduled");
        }

        Route newRoute = routeRepository.findById(newRouteId)
                .orElseThrow(() -> new RuntimeException("New route not found with id: " + newRouteId));

        if (!newRoute.getActive()) {
            throw new RuntimeException("New route is not active");
        }

        // Check seat availability on new route
        if (newRoute.getVehicle().getAvailableSeats() < booking.getNumberOfPassengers()) {
            throw new RuntimeException("Not enough seats available on new route");
        }

        // Release seats from old route
        vehicleService.releaseSeats(booking.getVehicle().getId(), booking.getNumberOfPassengers());

        // Update booking
        booking.setRoute(newRoute);
        booking.setVehicle(newRoute.getVehicle());
        booking.setTotalAmount(newRoute.getPrice().multiply(BigDecimal.valueOf(booking.getNumberOfPassengers())));

        // Book seats on new route
        vehicleService.updateAvailableSeats(newRoute.getVehicle().getId(), booking.getNumberOfPassengers());

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Booking getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + bookingReference));
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findByBookingDateBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
