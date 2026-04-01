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
    
    List<Seat> findAvailableSeats(String vehicleId);
    
    List<Seat> findByVehicleIdAndTypeAndStatus(String vehicleId, String type, SeatStatus status);
    
    @Query("SELECT s FROM Seat s WHERE s.vehicle.id = :vehicleId AND s.status = 'AVAILABLE' ORDER BY s.price ASC")
    List<Seat> findAvailableSeatsOrderByPrice(@Param("vehicleId") String vehicleId);
    
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.vehicle.id = :vehicleId AND s.status = :status")
    Long countByVehicleIdAndStatus(@Param("vehicleId") String vehicleId, @Param("status") SeatStatus status);
    
    @Query("SELECT s FROM Seat s WHERE s.type = :type AND s.price BETWEEN :minPrice AND :maxPrice")
    List<Seat> findByTypeAndPriceRange(@Param("type") String type, @Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);
    
    @Query("SELECT s FROM Seat s WHERE s.seatNumber LIKE CONCAT('%', :seatNumber, '%')")
    List<Seat> findBySeatNumberContaining(@Param("seatNumber") String seatNumber);
}
