package com.naren.backend.service;

import com.naren.backend.dto.BusPhotoResponse;
import com.naren.backend.entity.BusPhoto;
import com.naren.backend.repository.BusPhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusPhotoService {

    private final BusPhotoRepository busPhotoRepository;
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BusPhotoService.class);

    public List<BusPhotoResponse> getPhotosByVehicle(String vehicleId) {
        log.info("Fetching photos for vehicle: {}", vehicleId);
        List<BusPhoto> photos = busPhotoRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
        return photos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BusPhotoResponse getPrimaryPhoto(String vehicleId) {
        log.info("Fetching primary photo for vehicle: {}", vehicleId);
        List<BusPhoto> primaryPhotos = busPhotoRepository.findByVehicleIdAndIsPrimaryTrue(vehicleId);
        if (primaryPhotos.isEmpty()) {
            // If no primary photo is set, return the first photo
            List<BusPhoto> allPhotos = busPhotoRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
            if (allPhotos.isEmpty()) {
                return null;
            }
            return convertToResponse(allPhotos.get(0));
        }
        return convertToResponse(primaryPhotos.get(0));
    }

    private BusPhotoResponse convertToResponse(BusPhoto busPhoto) {
        return new BusPhotoResponse(
                busPhoto.getId(),
                busPhoto.getVehicle().getId(),
                busPhoto.getPhotoUrl(),
                busPhoto.getCaption(),
                busPhoto.getPhotoType(),
                busPhoto.getDisplayOrder(),
                busPhoto.getIsPrimary(),
                busPhoto.getCreatedAt()
        );
    }
}
