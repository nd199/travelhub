package com.naren.backend.DTO.mapper;

import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Record.VehicleResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class VehicleMapper implements Function<Vehicle, VehicleResponse> {

    @Override
    public VehicleResponse apply(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getType().name(),
                vehicle.getCapacity(),
                vehicle.getAmenities(),
                vehicle.getStatus().name(),
                vehicle.getRegistrationNumber(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt()
        );
    }
}
