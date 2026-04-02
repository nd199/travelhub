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
    
    @Query(value = "SELECT r FROM Route r JOIN Booking b ON r.id = b.schedule.route_id GROUP BY r.id ORDER BY COUNT(b.id) DESC", nativeQuery = true)
    List<Route> findPopularRoutes(int limit);
    
    List<Route> findByDistanceKmLessThan(double maxDistance);
    
    List<Route> findBySourceCity(String sourceCity);
    
    List<Route> findByDestinationCity(String destinationCity);
    
    @Query(value = "SELECT r FROM Route r WHERE r.source_city = :sourceCity AND r.destination_city = :destCity", nativeQuery = true)
    List<Route> findByCities(@Param("sourceCity") String sourceCity, @Param("destCity") String destCity);
    
    @Query(value = "SELECT r FROM Route r WHERE r.status = 'ACTIVE' ORDER BY r.distance_km ASC", nativeQuery = true)
    List<Route> findActiveRoutesOrderByDistance();
    
    @Query(value = "SELECT COUNT(r) FROM Route r WHERE r.source_id = :sourceId", nativeQuery = true)
    Long countBySourceId(@Param("sourceId") String sourceId);
}
