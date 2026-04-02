package com.naren.backend.repository;

import com.naren.backend.entity.Seat;
import com.naren.backend.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, String> {
    List<Seat> findByVehicleId(String vehicleId);
    
    List<Seat> findByStatus(SeatStatus status);
    
    List<Seat> findByVehicleIdAndStatus(String vehicleId, SeatStatus status);
    
    List<Seat> findByType(String type);
    
    List<Seat> findByPriceBetween(double minPrice, double maxPrice);
    
    List<Seat> findByVehicleIdAndType(String vehicleId, String type);
    
    List<Seat> findBySeatNumber(String seatNumber);
    
    @Query(value = "SELECT s FROM Seat s WHERE s.vehicle_id = :vehicleId AND s.status = 'AVAILABLE'", nativeQuery = true)
    List<Seat> findAvailableSeats(@Param("vehicleId") String vehicleId);
    
    List<Seat> findByVehicleIdAndTypeAndStatus(String vehicleId, String type, SeatStatus status);
    
    @Query(value = "SELECT s FROM Seat s WHERE s.vehicle_id = :vehicleId AND s.status = 'AVAILABLE' ORDER BY s.price ASC", nativeQuery = true)
    List<Seat> findAvailableSeatsOrderByPrice(@Param("vehicleId") String vehicleId);
    
    @Query(value = "SELECT COUNT(s) FROM Seat s WHERE s.vehicle_id = :vehicleId AND s.status = :status", nativeQuery = true)
    Long countByVehicleIdAndStatus(@Param("vehicleId") String vehicleId, @Param("status") SeatStatus status);
    
    @Query(value = "SELECT s FROM Seat s WHERE s.type = :type AND s.price BETWEEN :minPrice AND :maxPrice", nativeQuery = true)
    List<Seat> findByTypeAndPriceRange(@Param("type") String type, @Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);
    
    @Query(value = "SELECT s FROM Seat s WHERE s.seat_number LIKE CONCAT('%', :seatNumber, '%')", nativeQuery = true)
    List<Seat> findBySeatNumberContaining(@Param("seatNumber") String seatNumber);
}
