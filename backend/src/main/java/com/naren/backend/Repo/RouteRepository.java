package com.naren.backend.Repo;

import com.naren.backend.Entity.Route;
import com.naren.backend.Entity.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
    List<Route> findByStatus(RouteStatus status);
    List<Route> findBySourceId(String sourceId);
    List<Route> findByDestinationId(String destinationId);
}
