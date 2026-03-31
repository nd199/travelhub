package com.naren.backend.Service;

import com.naren.backend.Record.BookingResponse;
import com.naren.backend.DTO.mapper.BookingMapper;
import com.naren.backend.Entity.Booking;
import com.naren.backend.Entity.BookingStatus;
import com.naren.backend.Entity.Schedule;
import com.naren.backend.Entity.Users;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.BookingRequest;
import com.naren.backend.Repo.BookingRepository;
import com.naren.backend.Repo.ScheduleRepository;
import com.naren.backend.Repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, 
                         ScheduleRepository scheduleRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingMapper = bookingMapper;
    }

    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Users user = userRepository.findById(bookingRequest.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + bookingRequest.userId()));

        Schedule schedule = scheduleRepository.findById(bookingRequest.scheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + bookingRequest.scheduleId()));

        String bookingReference = generateBookingReference();
        
        if(bookingRepository.existsByBookingReference(bookingReference)) {
            throw new RuntimeException("Booking already exists with reference: " + bookingReference);
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
        return bookingMapper.apply(savedBooking);
    }

    public BookingResponse getBookingById(String id) {
        return bookingMapper.apply(bookingRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Booking Not Found")
        ));
    }

    public BookingResponse getBookingByReference(String bookingReference) {
        return bookingMapper.apply(bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Booking Not Found")
                ));
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper)
                .toList();
    }

    public List<BookingResponse> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper)
                .toList();
    }

    public List<BookingResponse> getBookingsByStatus(String status) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        return bookingRepository.findByStatus(bookingStatus).stream()
                .map(bookingMapper)
                .toList();
    }

    public List<BookingResponse> getBookingsByScheduleId(String scheduleId) {
        return bookingRepository.findByScheduleId(scheduleId).stream()
                .map(bookingMapper)
                .toList();
    }

    public BookingResponse updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
        if(!Objects.equals(newStatus, booking.getStatus())) {
            booking.setStatus(newStatus);
            bookingRepository.save(booking);
        }

        return bookingMapper.apply(booking);
    }

    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
    }

    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
