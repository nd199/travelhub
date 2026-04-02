package com.naren.backend.service;

import com.naren.backend.dto.RouteResponse;
import com.naren.backend.record.RouteRequest;

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
    
    List<RouteResponse> getRoutesBySourceAndDestination(String sourceId, String destinationId);
    List<RouteResponse> getRoutesByDistanceRange(double minDistance, double maxDistance);
    List<RouteResponse> getRoutesByDurationRange(int minDuration, int maxDuration);
    List<RouteResponse> getPopularRoutes(int limit);
    List<RouteResponse> getRoutesByDistanceLessThan(double maxDistance);
    List<RouteResponse> getRoutesBySourceCity(String sourceCity);
    List<RouteResponse> getRoutesByDestinationCity(String destinationCity);
    List<RouteResponse> getRoutesByCities(String sourceCity, String destCity);
    List<RouteResponse> getActiveRoutesOrderByDistance();
    Long getRouteCountBySourceId(String sourceId);
}
