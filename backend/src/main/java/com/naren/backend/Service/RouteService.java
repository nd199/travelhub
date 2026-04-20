package com.naren.backend.service;

import com.naren.backend.dto.RouteRequest;
import com.naren.backend.dto.RouteResponse;

import java.util.List;

public interface RouteService {
    
    RouteResponse createRoute(RouteRequest request);
    
    RouteResponse getRouteById(String id);
    
    List<RouteResponse> getAllRoutes();
    
    List<RouteResponse> getRoutesByStatus(String status);
    
    RouteResponse updateRoute(String id, RouteRequest request);
    
    void deleteRoute(String id);
    
    List<RouteResponse> getRoutesByCities(String sourceCity, String destCity);
}
