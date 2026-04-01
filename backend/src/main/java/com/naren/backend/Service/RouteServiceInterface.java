package com.naren.backend.Service;

import com.naren.backend.DTO.RouteResponse;
import com.naren.backend.Record.RouteRequest;

import java.util.List;

public interface RouteServiceInterface {
    RouteResponse createRoute(RouteRequest routeRequest);
    RouteResponse getRouteById(String id);
    List<RouteResponse> getAllRoutes();
    List<RouteResponse> getRoutesByStatus(String status);
    List<RouteResponse> getRoutesBySourceLocation(String sourceLocationId);
    List<RouteResponse> getRoutesByDestinationLocation(String destinationLocationId);
    RouteResponse updateRoute(String id, RouteRequest routeRequest);
    void deleteRoute(String id);
}
