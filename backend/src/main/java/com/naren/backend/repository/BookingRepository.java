package com.naren.backend.repository;

import com.naren.backend.entity.Booking;
import com.naren.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByUserId(String userId);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByScheduleId(String scheduleId);
    
    boolean existsByBookingReference(String bookingReference);
    
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
    
    Long countByUserId(String userId);
    
    @Query(value = "SELECT SUM(final_amount) FROM bookings WHERE user_id = :userId AND status = 'CONFIRMED'", nativeQuery = true)
    double totalRevenueByUser(@Param("userId") String userId);

    @Query(value = "SELECT SUM(final_amount) FROM bookings WHERE user_id = :userId AND YEAR(created_at) = :year AND status = 'CONFIRMED'", nativeQuery = true)
    double totalRevenueByUserOnYear(@Param("year") Long year, @Param("userId") String userId);

    @Query(value = "SELECT SUM(final_amount) FROM bookings WHERE YEAR(created_at) = :year AND status = 'CONFIRMED'", nativeQuery = true)
    double totalRevenueOnYear(@Param("year") Long year);

    @Query(value = "SELECT COUNT(*) FROM bookings WHERE YEAR(created_at) = :year AND status = 'CONFIRMED'", nativeQuery = true)
    Long totalBookingsOnYear(@Param("year") Long year);
}
