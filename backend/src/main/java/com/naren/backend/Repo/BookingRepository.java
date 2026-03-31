package com.naren.backend.Repo;

import com.naren.backend.Entity.Booking;
import com.naren.backend.Entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByScheduleId(String scheduleId);

    boolean existsByBookingReference(String bookingReference);
}
