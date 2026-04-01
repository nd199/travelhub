package com.naren.backend.Repo;

import com.naren.backend.Entity.Location;
import com.naren.backend.Entity.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {
    List<Location> findByCity(String city);
    
    List<Location> findByState(String state);
    
    List<Location> findByCountry(String country);
    
    List<Location> findByCityAndCountry(String city, String country);
    
    List<Location> findByType(LocationType type);
    
    List<Location> findByNameContaining(String name);
    
    List<Location> findByPincode(String pincode);
    
    List<Location> findByLatitudeBetween(double minLat, double maxLat);
    
    List<Location> findByLongitudeBetween(double minLng, double maxLng);
    
    List<Location> findByLatitudeBetweenAndLongitudeBetween(double minLat, double maxLat, double minLng, double maxLng);
    
    @Query("SELECT l FROM Location l WHERE l.city = :city AND l.type = :type")
    List<Location> findByCityAndType(@Param("city") String city, @Param("type") LocationType type);
    
    @Query("SELECT l FROM Location l WHERE l.country = :country ORDER BY l.city ASC")
    List<Location> findByCountryOrderByCity(@Param("country") String country);
    
    @Query("SELECT COUNT(l) FROM Location l WHERE l.type = :type")
    Long countByType(@Param("type") LocationType type);
    
    @Query("SELECT l FROM Location l WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(l.latitude)) * " +
           "cos(radians(l.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(l.latitude))) <= :radius)")
    List<Location> findNearbyLocations(@Param("lat") double latitude, 
                                      @Param("lng") double longitude, 
                                      @Param("radius") double radius);
}
