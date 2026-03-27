package com.naren.backend.repository;

import com.naren.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    
    List<Passenger> findByBookingId(Long bookingId);
    
    List<Passenger> findBySeatNumber(String seatNumber);
}
