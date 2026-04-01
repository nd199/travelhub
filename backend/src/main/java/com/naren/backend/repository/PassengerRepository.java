package com.naren.backend.repository;

import com.naren.backend.entity.Gender;
import com.naren.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, String> {
    List<Passenger> findByBookingId(String bookingId);

    List<Passenger> findBySeatId(String seatId);

    @Query(value = "SELECT * FROM passengers WHERE checked_in = :checkedIn", nativeQuery = true)
    List<Passenger> findByCheckedIn(@Param("checkedIn") Boolean checkedIn);

    @Query(value = "SELECT * FROM passengers WHERE phone_number = :phoneNumber", nativeQuery = true)
    List<Passenger> findPassengersByContactNumber(@Param("phoneNumber") String phoneNumber);

    @Query(value = "SELECT * FROM passengers WHERE age BETWEEN :minAge AND :maxAge", nativeQuery = true)
    List<Passenger> findPassengersByAgeBetween(@Param("minAge") int minAge, @Param("maxAge") int maxAge);

    List<Passenger> findPassengersByGender(Gender gender);

    @Query(value = "SELECT * FROM passengers WHERE age BETWEEN :minAge AND :maxAge AND gender = :gender", nativeQuery = true)
    List<Passenger> findPassengersByAgeBetweenAndGender(@Param("minAge") int minAge, @Param("maxAge") int maxAge, @Param("gender") Gender gender);

    @Query(value = "SELECT * FROM passengers WHERE name ILIKE CONCAT('%', :name, '%')", nativeQuery = true)
    List<Passenger> findPassengersByNameContaining(@Param("name") String name);

    @Query(value = "SELECT * FROM passengers WHERE age BETWEEN :minAge AND :maxAge AND name ILIKE CONCAT('%', :name, '%')", nativeQuery = true)
    List<Passenger> findPassengersByAgeBetweenAndNameContaining(@Param("minAge") int minAge, @Param("maxAge") int maxAge, @Param("name") String name);
}
