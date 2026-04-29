package com.naren.backend.service;

import com.naren.backend.dto.SeatResponse;
import java.util.List;

public interface SeatService {
    List<SeatResponse> getSeatsByVehicleId(String vehicleId);
    SeatResponse getSeatById(String id);
    List<SeatResponse> getAvailableSeatsByVehicleId(String vehicleId);
}
