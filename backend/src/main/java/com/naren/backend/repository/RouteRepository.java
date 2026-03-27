package com.naren.backend.repository;

import com.naren.backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    List<Route> findBySourceAndDestination(String source, String destination);
    
    List<Route> findBySource(String source);
    
    List<Route> findByDestination(String destination);
    
    List<Route> findByActiveTrue();
    
    @Query("SELECT r FROM Route r WHERE r.source = :source AND r.destination = :destination AND r.departureTime >= :departureTime AND r.active = true")
    List<Route> findAvailableRoutes(
        @Param("source") String source,
        @Param("destination") String destination,
        @Param("departureTime") LocalDateTime departureTime
    );
    
    @Query("SELECT r FROM Route r WHERE r.vehicle.id = :vehicleId AND r.active = true")
    List<Route> findByVehicleId(@Param("vehicleId") Long vehicleId);
}
