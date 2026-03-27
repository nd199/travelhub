package com.naren.backend.service;

import com.naren.backend.entity.Route;
import com.naren.backend.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteService {

    private final RouteRepository routeRepository;

    public Route createRoute(Route route) {
        if (route.getArrivalTime().isBefore(route.getDepartureTime())) {
            throw new RuntimeException("Arrival time must be after departure time");
        }
        return routeRepository.save(route);
    }

    public Route updateRoute(Long id, Route routeDetails) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));

        route.setSource(routeDetails.getSource());
        route.setDestination(routeDetails.getDestination());
        route.setDepartureTime(routeDetails.getDepartureTime());
        route.setArrivalTime(routeDetails.getArrivalTime());
        route.setPrice(routeDetails.getPrice());
        route.setActive(routeDetails.getActive());
        route.setDescription(routeDetails.getDescription());
        route.setVehicle(routeDetails.getVehicle());

        return routeRepository.save(route);
    }

    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
        routeRepository.delete(route);
    }

    @Transactional(readOnly = true)
    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Route> getActiveRoutes() {
        return routeRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Route> getRoutesBySourceAndDestination(String source, String destination) {
        return routeRepository.findBySourceAndDestination(source, destination);
    }

    @Transactional(readOnly = true)
    public List<Route> getRoutesBySource(String source) {
        return routeRepository.findBySource(source);
    }

    @Transactional(readOnly = true)
    public List<Route> getRoutesByDestination(String destination) {
        return routeRepository.findByDestination(destination);
    }

    @Transactional(readOnly = true)
    public List<Route> searchAvailableRoutes(String source, String destination, LocalDateTime departureTime) {
        return routeRepository.findAvailableRoutes(source, destination, departureTime);
    }

    @Transactional(readOnly = true)
    public List<Route> getRoutesByVehicleId(Long vehicleId) {
        return routeRepository.findByVehicleId(vehicleId);
    }
}
