package com.naren.backend.repository;

import com.naren.backend.entity.Route;
import com.naren.backend.entity.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
    List<Route> findByStatus(RouteStatus status);
    
    List<Route> findBySourceId(String sourceId);
    
    List<Route> findByDestinationId(String destinationId);
    
    List<Route> findBySourceIdAndDestinationId(String sourceId, String destinationId);
    
    List<Route> findByDistanceKmBetween(double minDistance, double maxDistance);
    
    List<Route> findByEstimatedDurationMinutesBetween(int minDuration, int maxDuration);
    
    List<Route> findPopularRoutes(int limit);
    
    List<Route> findByDistanceKmLessThan(double maxDistance);
    
    List<Route> findBySourceCity(String sourceCity);
    
    List<Route> findByDestinationCity(String destinationCity);
    
    @Query("SELECT r FROM Route r WHERE r.source.city = :sourceCity AND r.destination.city = :destCity")
    List<Route> findByCities(@Param("sourceCity") String sourceCity, @Param("destCity") String destCity);
    
    @Query("SELECT r FROM Route r WHERE r.status = 'ACTIVE' ORDER BY r.distanceKm ASC")
    List<Route> findActiveRoutesOrderByDistance();
    
    @Query("SELECT COUNT(r) FROM Route r WHERE r.source.id = :sourceId")
    Long countBySourceId(@Param("sourceId") String sourceId);
}
