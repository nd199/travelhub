package com.naren.backend.dto.mapper;

import com.naren.backend.Entity.Location;
import com.naren.backend.Record.LocationResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class LocationMapper implements Function<Location, LocationResponse> {

    @Override
    public LocationResponse apply(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getName(),
                location.getCity(),
                location.getState(),
                location.getCountry(),
                location.getLatitude(),
                location.getLongitude(),
                location.getType().name(),
                location.getAddress(),
                location.getPincode(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }
}
