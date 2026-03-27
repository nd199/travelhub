package com.naren.backend.repository;

import com.naren.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByRouteId(Long routeId);
    
    List<Booking> findByVehicleId(Long vehicleId);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status")
    List<Booking> findByUserIdAndStatus(
        @Param("userId") Long userId,
        @Param("status") Booking.BookingStatus status
    );
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByBookingDateBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.route.id = :routeId AND b.status = 'CONFIRMED'")
    Long countConfirmedBookingsByRouteId(@Param("routeId") Long routeId);
}
