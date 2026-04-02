package com.naren.backend.dto.mapper;

import com.naren.backend.entity.Schedule;
import com.naren.backend.dto.ScheduleResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class ScheduleMapper implements Function<Schedule, ScheduleResponse> {

    @Override
    public ScheduleResponse apply(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getId(),
                schedule.getVehicle().getId(),
                schedule.getRoute().getId(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                schedule.getActualDepartureTime(),
                schedule.getActualArrivalTime(),
                schedule.getPrice(),
                schedule.getAvailableSeats(),
                schedule.getStatus().name(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()
        );
    }
}
