package com.naren.backend.service;

import com.naren.backend.dto.mapper.BookingMapper;
import com.naren.backend.entity.Booking;
import com.naren.backend.entity.BookingStatus;
import com.naren.backend.entity.Schedule;
import com.naren.backend.entity.Users;
import com.naren.backend.exception.DuplicateResourceException;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.record.BookingRequest;
import com.naren.backend.dto.BookingResponse;
import com.naren.backend.repository.BookingRepository;
import com.naren.backend.repository.ScheduleRepository;
import com.naren.backend.repository.UserRepository;
import com.naren.backend.service.BookingServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingMapper bookingMapper;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, 
                              ScheduleRepository scheduleRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingMapper = bookingMapper;
    }

    @Override
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        logger.info("Creating booking for user id: {}", bookingRequest.userId());
        Users user = userRepository.findById(bookingRequest.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + bookingRequest.userId()));

        Schedule schedule = scheduleRepository.findById(bookingRequest.scheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + bookingRequest.scheduleId()));

        String bookingReference = generateBookingReference();
        
        if(bookingRepository.existsByBookingReference(bookingReference)) {
            logger.error("Booking already exists with reference: {}", bookingReference);
            throw new DuplicateResourceException("Booking already exists with reference: " + bookingReference);
        }

        Booking booking = Booking
                .builder()
                .bookingReference(bookingReference)
                .user(user)
                .schedule(schedule)
                .status(BookingStatus.PENDING)
                .totalAmount(bookingRequest.totalAmount())
                .discountAmount(bookingRequest.discountAmount())
                .taxAmount(bookingRequest.taxAmount())
                .finalAmount(bookingRequest.finalAmount())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Booking created successfully with reference: {}", savedBooking.getBookingReference());
        return bookingMapper.apply(savedBooking);
    }

    @Override
    public BookingResponse getBookingById(String id) {
        logger.info("Fetching booking by id: {}", id);
        return bookingMapper.apply(bookingRepository.findById(id).orElseThrow(
                () -> {
                    logger.error("Booking not found with id: {}", id);
                    return new ResourceNotFoundException("Booking Not Found");
                }
        ));
    }

    @Override
    public BookingResponse getBookingByReference(String bookingReference) {
        logger.info("Fetching booking by reference: {}", bookingReference);
        return bookingMapper.apply(bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(
                        () -> {
                            logger.error("Booking not found with reference: {}", bookingReference);
                            return new ResourceNotFoundException("Booking Not Found");
                        }
                ));
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        logger.info("Fetching all bookings");
        List<BookingResponse> bookings = bookingRepository.findAll().stream()
                .map(bookingMapper)
                .toList();
        logger.info("Retrieved {} bookings", bookings.size());
        return bookings;
    }

    @Override
    public List<BookingResponse> getBookingsByUserId(String userId) {
        logger.info("Fetching bookings by user id: {}", userId);
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByStatus(String status) {
        logger.info("Fetching bookings by status: {}", status);
        BookingStatus bookingStatus = parseBookingStatus(status);
        return bookingRepository.findByStatus(bookingStatus).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByScheduleId(String scheduleId) {
        logger.info("Fetching bookings by schedule id: {}", scheduleId);
        return bookingRepository.findByScheduleId(scheduleId).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(String id, String status) {
        logger.info("Updating booking status for id: {} to status: {}", id, status);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Booking not found with id: {}", id);
                    return new ResourceNotFoundException("Booking not found with id: " + id);
                });

        BookingStatus newStatus = parseBookingStatus(status);
        if(!Objects.equals(newStatus, booking.getStatus())) {
            booking.setStatus(newStatus);
            bookingRepository.save(booking);
            logger.info("Booking status updated successfully for id: {} to {}", id, status);
        } else {
            logger.info("No status change needed for booking id: {}", id);
        }

        return bookingMapper.apply(booking);
    }

    @Override
    public void deleteBooking(String id) {
        logger.info("Deleting booking with id: {}", id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Booking not found with id: {}", id);
                    return new ResourceNotFoundException("Booking not found with id: " + id);
                });
        bookingRepository.delete(booking);
        logger.info("Booking deleted successfully with id: {}", id);
    }

    @Override
    public List<BookingResponse> getBookingsByTravelDate(LocalDateTime travelDate) {
        logger.info("Fetching bookings by travel date: {}", travelDate);
        return bookingRepository.findByTravelDate(travelDate).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByTravelDateBefore(LocalDateTime dateTime) {
        logger.info("Fetching bookings by travel date before: {}", dateTime);
        return bookingRepository.findByTravelDateBefore(dateTime).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByTravelDateBetween(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching bookings by travel date between: {} and {}", start, end);
        return bookingRepository.findByTravelDateBetween(start, end).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByUserIdAndStatus(String userId, String status) {
        logger.info("Fetching bookings by user id: {} and status: {}", userId, status);
        BookingStatus bookingStatus = parseBookingStatus(status);
        return bookingRepository.findByUserIdAndStatus(userId, bookingStatus).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByUserIdAndTravelDateBetween(String userId, LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching bookings by user id: {} and travel date between: {} and {}", userId, start, end);
        return bookingRepository.findByUserIdAndTravelDateBetween(userId, start, end).stream()
                .map(bookingMapper)
                .toList();
    }

    @Override
    public Long getBookingCountByUserId(String userId) {
        logger.info("Getting booking count by user id: {}", userId);
        return bookingRepository.countByUserId(userId);
    }

    @Override
    public Double getTotalRevenueByUser(String userId) {
        logger.info("Getting total revenue by user id: {}", userId);
        return bookingRepository.totalRevenueByUser(userId);
    }

    @Override
    public Double getTotalRevenueByUserOnYear(Long year, String userId) {
        logger.info("Getting total revenue by year: {} and user id: {}", year, userId);
        return bookingRepository.totalRevenueByUserOnYear(year, userId);
    }

    @Override
    public Double getTotalRevenueOnYear(Long year) {
        logger.info("Getting total revenue by year: {}", year);
        return bookingRepository.totalRevenueOnYear(year);
    }

    @Override
    public Long getTotalBookingsOnYear(Long year) {
        logger.info("Getting total bookings by year: {}", year);
        return bookingRepository.totalBookingsOnYear(year);
    }

    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BookingStatus parseBookingStatus(String status) {
        logger.debug("Parsing booking status: {}", status);
        if (status == null || status.trim().isEmpty()) {
            logger.error("Booking status cannot be null or empty");
            throw new InvalidInputException("Booking status cannot be null or empty");
        }
        try {
            BookingStatus result = BookingStatus.valueOf(status.trim().toUpperCase());
            logger.debug("Parsed booking status: {}", result);
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid booking status: {}", status);
            throw new InvalidInputException("Invalid booking status: " + status + ". Valid statuses are: " + java.util.Arrays.toString(BookingStatus.values()));
        }
    }
}
