package com.naren.backend.repository;

import com.naren.backend.entity.Schedule;
import com.naren.backend.entity.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    List<Schedule> findByVehicleId(String vehicleId);
    
    List<Schedule> findByRouteId(String routeId);
    
    List<Schedule> findByStatus(ScheduleStatus status);
    
    List<Schedule> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<Schedule> findByDepartureTimeAfter(LocalDateTime time);
    
    List<Schedule> findByDepartureTimeBefore(LocalDateTime time);
    
    List<Schedule> findByArrivalTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<Schedule> findByVehicleIdAndDepartureTimeBetween(String vehicleId, LocalDateTime start, LocalDateTime end);
    
    List<Schedule> findByRouteIdAndStatus(String routeId, ScheduleStatus status);
    
    List<Schedule> findByPriceBetween(double minPrice, double maxPrice);
    
    List<Schedule> findByAvailableSeatsGreaterThan(int minSeats);
    
    List<Schedule> findByStatusAndDepartureTimeAfter(ScheduleStatus status, LocalDateTime time);
    
    @Query("SELECT s FROM Schedule s WHERE s.departureTime BETWEEN :start AND :end AND s.status = 'SCHEDULED'")
    List<Schedule> findAvailableSchedules(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.vehicle.id = :vehicleId AND s.status = :status")
    Long countByVehicleIdAndStatus(@Param("vehicleId") String vehicleId, @Param("status") ScheduleStatus status);
}
