package com.naren.backend.Service;

import com.naren.backend.Record.RouteResponse;
import com.naren.backend.DTO.mapper.RouteMapper;
import com.naren.backend.Entity.Location;
import com.naren.backend.Entity.Route;
import com.naren.backend.Entity.RouteStatus;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.RouteRequest;
import com.naren.backend.Repo.LocationRepository;
import com.naren.backend.Repo.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final LocationRepository locationRepository;
    private final RouteMapper routeMapper;

    public RouteService(RouteRepository routeRepository, LocationRepository locationRepository, RouteMapper routeMapper) {
        this.routeRepository = routeRepository;
        this.locationRepository = locationRepository;
        this.routeMapper = routeMapper;
    }

    public RouteResponse createRoute(RouteRequest routeRequest) {
        Location sourceLocation = locationRepository.findById(routeRequest.sourceLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Source location not found with id: " + routeRequest.sourceLocationId()));

        Location destinationLocation = locationRepository.findById(routeRequest.destinationLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination location not found with id: " + routeRequest.destinationLocationId()));

        if(sourceLocation.getId().equals(destinationLocation.getId())) {
            throw new RuntimeException("Source and destination locations cannot be the same");
        }

        Route route = Route
                .builder()
                .source(sourceLocation)
                .destination(destinationLocation)
                .distanceKm(routeRequest.distanceKm())
                .estimatedDurationMinutes(routeRequest.estimatedDurationMinutes())
                .description(routeRequest.description())
                .status(RouteStatus.valueOf(routeRequest.status().toUpperCase()))
                .build();

        Route savedRoute = routeRepository.save(route);
        return routeMapper.apply(savedRoute);
    }

    public RouteResponse getRouteById(String id) {
        return routeMapper.apply(routeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Route Not Found")
        ));
    }

    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(routeMapper)
                .toList();
    }

    public List<RouteResponse> getRoutesByStatus(String status) {
        RouteStatus routeStatus = RouteStatus.valueOf(status.toUpperCase());
        return routeRepository.findByStatus(routeStatus).stream()
                .map(routeMapper)
                .toList();
    }

    public List<RouteResponse> getRoutesBySourceLocation(String sourceLocationId) {
        return routeRepository.findBySourceId(sourceLocationId).stream()
                .map(routeMapper)
                .toList();
    }

    public List<RouteResponse> getRoutesByDestinationLocation(String destinationLocationId) {
        return routeRepository.findByDestinationId(destinationLocationId).stream()
                .map(routeMapper)
                .toList();
    }

    public RouteResponse updateRoute(String id, RouteRequest routeRequest) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        boolean needsUpdate = false;

        if(Objects.nonNull(routeRequest.sourceLocationId()) &&
                !Objects.equals(routeRequest.sourceLocationId(), route.getSource().getId())) {
            Location sourceLocation = locationRepository.findById(routeRequest.sourceLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source location not found with id: " + routeRequest.sourceLocationId()));
            route.setSource(sourceLocation);
            needsUpdate = true;
        }

        if(Objects.nonNull(routeRequest.destinationLocationId()) &&
                !Objects.equals(routeRequest.destinationLocationId(), route.getDestination().getId())) {
            Location destinationLocation = locationRepository.findById(routeRequest.destinationLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination location not found with id: " + routeRequest.destinationLocationId()));
            route.setDestination(destinationLocation);
            needsUpdate = true;
        }

        if(Objects.nonNull(routeRequest.distanceKm()) &&
                !Objects.equals(routeRequest.distanceKm(), route.getDistanceKm())) {
            route.setDistanceKm(routeRequest.distanceKm());
            needsUpdate = true;
        }

        if(Objects.nonNull(routeRequest.estimatedDurationMinutes()) &&
                !Objects.equals(routeRequest.estimatedDurationMinutes(), route.getEstimatedDurationMinutes())) {
            route.setEstimatedDurationMinutes(routeRequest.estimatedDurationMinutes());
            needsUpdate = true;
        }

        if(Objects.nonNull(routeRequest.description()) &&
                !Objects.equals(routeRequest.description(), route.getDescription())) {
            route.setDescription(routeRequest.description());
            needsUpdate = true;
        }

        if(Objects.nonNull(routeRequest.status())) {
            RouteStatus status = RouteStatus.valueOf(routeRequest.status().toUpperCase());
            if(!Objects.equals(status, route.getStatus())) {
                route.setStatus(status);
                needsUpdate = true;
            }
        }

        if(needsUpdate) {
            routeRepository.save(route);
        }

        return routeMapper.apply(route);
    }

    public void deleteRoute(String id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        routeRepository.delete(route);
    }
}
