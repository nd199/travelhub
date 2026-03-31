package com.naren.backend.Repo;

import com.naren.backend.Entity.Location;
import com.naren.backend.Entity.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {
    List<Location> findByCity(String city);

    List<Location> findByCountry(String country);

    List<Location> findByType(LocationType type);

    List<Location> findByCityAndCountry(String city, String country);
}
