package com.naren.backend.Record;

import java.time.LocalDateTime;

public record LocationResponse(
        String id,
        String name,
        String city,
        String state,
        String country,
        Double latitude,
        Double longitude,
        String type,
        String address,
        String pincode,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
