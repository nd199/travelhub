package com.naren.backend.repository;

import com.naren.backend.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, String> {
    List<BookingSeat> findByBookingId(String bookingId);

    List<BookingSeat> findBySeatId(String seatId);


}
