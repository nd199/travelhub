package com.naren.backend.service;

import com.naren.backend.dto.LocationRequest;
import com.naren.backend.dto.LocationResponse;
import com.naren.backend.entity.Location;
import com.naren.backend.entity.LocationType;
import com.naren.backend.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public LocationResponse createLocation(LocationRequest request) {
        Location location = new Location();
        location.setName(request.name());
        location.setCity(request.city());
        location.setState(request.state());
        location.setCountry(request.country());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());
        location.setType(LocationType.valueOf(request.type()));
        location.setAddress(request.address());
        location.setPincode(request.pincode());
        Location saved = locationRepository.save(location);
        return mapToLocationResponse(saved);
    }

    @Override
    public LocationResponse getLocationById(String id) {
        return locationRepository.findById(id)
                .map(this::mapToLocationResponse)
                .orElse(null);
    }

    @Override
    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationResponse> getLocationsByType(String type) {
        LocationType locationType = LocationType.valueOf(type);
        return locationRepository.findByType(locationType).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationResponse> getLocationsByCity(String city) {
        return locationRepository.findByCity(city).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationResponse> getLocationsByCountry(String country) {
        return locationRepository.findByCountryOrderByCity(country).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationResponse> getLocationsByState(String state) {
        return locationRepository.findByState(state).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationResponse> getLocationsByCityAndType(String city, String type) {
        LocationType locationType = LocationType.valueOf(type);
        return locationRepository.findByCityAndType(city, locationType).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Long getLocationCountByType(String type) {
        LocationType locationType = LocationType.valueOf(type);
        return locationRepository.countByType(locationType);
    }

    @Override
    public LocationResponse updateLocation(String id, LocationRequest request) {
        return locationRepository.findById(id)
                .map(location -> {
                    location.setName(request.name());
                    location.setCity(request.city());
                    location.setState(request.state());
                    location.setCountry(request.country());
                    location.setLatitude(request.latitude());
                    location.setLongitude(request.longitude());
                    location.setType(LocationType.valueOf(request.type()));
                    location.setAddress(request.address());
                    location.setPincode(request.pincode());
                    return mapToLocationResponse(locationRepository.save(location));
                })
                .orElse(null);
    }

    @Override
    public void deleteLocation(String id) {
        locationRepository.deleteById(id);
    }

    private LocationResponse mapToLocationResponse(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getName(),
                location.getCity(),
                location.getState(),
                location.getCountry(),
                location.getLatitude(),
                location.getLongitude(),
                location.getType() != null ? location.getType().name() : null,
                location.getAddress(),
                location.getPincode(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }
}
