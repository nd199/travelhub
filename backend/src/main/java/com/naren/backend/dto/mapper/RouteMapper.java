package com.naren.backend.dto.mapper;

import com.naren.backend.entity.Route;
import com.naren.backend.dto.RouteResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class RouteMapper implements Function<Route, RouteResponse> {

    @Override
    public RouteResponse apply(Route route) {
        return new RouteResponse(
                route.getId(),
                route.getSource().getId(),
                route.getDestination().getId(),
                route.getDistanceKm(),
                route.getEstimatedDurationMinutes(),
                route.getDescription(),
                route.getStatus().name(),
                route.getCreatedAt(),
                route.getUpdatedAt()
        );
    }
}
