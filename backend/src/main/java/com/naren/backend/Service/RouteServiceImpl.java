package com.naren.backend.service;

import com.naren.backend.dto.mapper.RouteMapper;
import com.naren.backend.entity.Location;
import com.naren.backend.entity.Route;
import com.naren.backend.entity.RouteStatus;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.exception.RouteException;
import com.naren.backend.record.RouteRequest;
import com.naren.backend.dto.RouteResponse;
import com.naren.backend.repository.LocationRepository;
import com.naren.backend.repository.RouteRepository;
import com.naren.backend.service.RouteServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class RouteServiceImpl implements RouteServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(RouteServiceImpl.class);

    private final RouteRepository routeRepository;
    private final LocationRepository locationRepository;
    private final RouteMapper routeMapper;

    public RouteServiceImpl(RouteRepository routeRepository, LocationRepository locationRepository, RouteMapper routeMapper) {
        this.routeRepository = routeRepository;
        this.locationRepository = locationRepository;
        this.routeMapper = routeMapper;
    }

    @Override
    public RouteResponse createRoute(RouteRequest routeRequest) {
        Location sourceLocation = locationRepository.findById(routeRequest.sourceLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Source location not found: " + routeRequest.sourceLocationId()));

        Location destinationLocation = locationRepository.findById(routeRequest.destinationLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination location not found: " + routeRequest.destinationLocationId()));

        if(sourceLocation.getId().equals(destinationLocation.getId())) {
            throw new RouteException("Source and destination cannot be the same");
        }

        Route route = Route.builder()
                .source(sourceLocation)
                .destination(destinationLocation)
                .distanceKm(routeRequest.distanceKm())
                .estimatedDurationMinutes(routeRequest.estimatedDurationMinutes())
                .description(routeRequest.description())
                .status(parseRouteStatus(routeRequest.status()))
                .build();

        return routeMapper.apply(routeRepository.save(route));
    }

    @Override
    public RouteResponse getRouteById(String id) {
        return routeMapper.apply(routeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Route not found")
        ));
    }

    @Override
    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByStatus(String status) {
        RouteStatus routeStatus = parseRouteStatus(status);
        return routeRepository.findByStatus(routeStatus).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesBySourceLocation(String sourceLocationId) {
        return routeRepository.findBySourceId(sourceLocationId).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByDestinationLocation(String destinationLocationId) {
        return routeRepository.findByDestinationId(destinationLocationId).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public RouteResponse updateRoute(String id, RouteRequest routeRequest) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + id));

        if(routeRequest.sourceLocationId() != null && 
           !routeRequest.sourceLocationId().equals(route.getSource().getId())) {
            Location sourceLocation = locationRepository.findById(routeRequest.sourceLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source location not found: " + routeRequest.sourceLocationId()));
            route.setSource(sourceLocation);
        }

        if(routeRequest.destinationLocationId() != null &&
           !routeRequest.destinationLocationId().equals(route.getDestination().getId())) {
            Location destinationLocation = locationRepository.findById(routeRequest.destinationLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination location not found: " + routeRequest.destinationLocationId()));
            route.setDestination(destinationLocation);
        }

        if(routeRequest.distanceKm() != null) {
            route.setDistanceKm(routeRequest.distanceKm());
        }

        if(routeRequest.estimatedDurationMinutes() != null) {
            route.setEstimatedDurationMinutes(routeRequest.estimatedDurationMinutes());
        }

        if(routeRequest.description() != null) {
            route.setDescription(routeRequest.description());
        }

        if(routeRequest.status() != null) {
            route.setStatus(parseRouteStatus(routeRequest.status()));
        }

        return routeMapper.apply(routeRepository.save(route));
    }

    @Override
    public void deleteRoute(String id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + id));
        routeRepository.delete(route);
    }

    @Override
    public List<RouteResponse> getRoutesBySourceAndDestination(String sourceId, String destinationId) {
        return routeRepository.findBySourceIdAndDestinationId(sourceId, destinationId).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByDistanceRange(double minDistance, double maxDistance) {
        return routeRepository.findByDistanceKmBetween(minDistance, maxDistance).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByDurationRange(int minDuration, int maxDuration) {
        return routeRepository.findByEstimatedDurationMinutesBetween(minDuration, maxDuration).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getPopularRoutes(int limit) {
        return routeRepository.findPopularRoutes(limit).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByDistanceLessThan(double maxDistance) {
        return routeRepository.findByDistanceKmLessThan(maxDistance).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesBySourceCity(String sourceCity) {
        return routeRepository.findBySourceCity(sourceCity).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByDestinationCity(String destinationCity) {
        return routeRepository.findByDestinationCity(destinationCity).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getRoutesByCities(String sourceCity, String destCity) {
        return routeRepository.findByCities(sourceCity, destCity).stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public List<RouteResponse> getActiveRoutesOrderByDistance() {
        return routeRepository.findActiveRoutesOrderByDistance().stream()
                .map(routeMapper)
                .toList();
    }

    @Override
    public Long getRouteCountBySourceId(String sourceId) {
        return routeRepository.countBySourceId(sourceId);
    }

    private RouteStatus parseRouteStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidInputException("Route status cannot be empty");
        }
        try {
            return RouteStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid route status: " + status);
        }
    }
}
