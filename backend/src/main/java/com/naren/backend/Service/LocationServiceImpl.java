package com.naren.backend.service;

import com.naren.backend.dto.mapper.LocationMapper;
import com.naren.backend.entity.Location;
import com.naren.backend.entity.LocationType;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.dto.LocationResponse;
import com.naren.backend.record.LocationRequest;
import com.naren.backend.repository.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(LocationServiceImpl.class);

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationServiceImpl(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    @Override
    public LocationResponse createLocation(LocationRequest locationRequest) {
        Location location = Location.builder()
                .name(locationRequest.name())
                .city(locationRequest.city())
                .state(locationRequest.state())
                .country(locationRequest.country())
                .latitude(locationRequest.latitude())
                .longitude(locationRequest.longitude())
                .type(parseLocationType(locationRequest.type()))
                .address(locationRequest.address())
                .pincode(locationRequest.pincode())
                .build();

        Location savedLocation = locationRepository.save(location);
        log.info("Created location {}", savedLocation.getId());
        return locationMapper.apply(savedLocation);
    }

    @Override
    public LocationResponse getLocationById(String id) {
        return locationMapper.apply(locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found")));
    }

    @Override
    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCity(String city) {
        return locationRepository.findByCity(city).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCountry(String country) {
        return locationRepository.findByCountry(country).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByType(String type) {
        LocationType locationType = parseLocationType(type);
        return locationRepository.findByType(locationType).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCityAndCountry(String city, String country) {
        return locationRepository.findByCityAndCountry(city, country).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public LocationResponse updateLocation(String id, LocationRequest locationRequest) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + id));

        if (locationRequest.name() != null) {
            location.setName(locationRequest.name());
        }

        if (locationRequest.city() != null) {
            location.setCity(locationRequest.city());
        }

        if (locationRequest.state() != null) {
            location.setState(locationRequest.state());
        }

        if (locationRequest.country() != null) {
            location.setCountry(locationRequest.country());
        }

        if (locationRequest.latitude() != null) {
            location.setLatitude(locationRequest.latitude());
        }

        if (locationRequest.longitude() != null) {
            location.setLongitude(locationRequest.longitude());
        }

        if (locationRequest.type() != null) {
            location.setType(parseLocationType(locationRequest.type()));
        }

        if (locationRequest.address() != null) {
            location.setAddress(locationRequest.address());
        }

        if (locationRequest.pincode() != null) {
            location.setPincode(locationRequest.pincode());
        }

        return locationMapper.apply(locationRepository.save(location));
    }

    @Override
    public void deleteLocation(String id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + id));
        locationRepository.delete(location);
        log.info("Deleted location {}", id);
    }

    @Override
    public List<LocationResponse> getLocationsByState(String state) {
        return locationRepository.findByState(state).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByNameContaining(String name) {
        return locationRepository.findByNameContaining(name).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByPincode(String pincode) {
        return locationRepository.findByPincode(pincode).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByLatitudeBetween(double minLat, double maxLat) {
        return locationRepository.findByLatitudeBetween(minLat, maxLat).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByLongitudeBetween(double minLng, double maxLng) {
        return locationRepository.findByLongitudeBetween(minLng, maxLng).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCoordinatesBetween(double minLat, double maxLat, double minLng, double maxLng) {
        return locationRepository.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, minLng, maxLng).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCityAndType(String city, String type) {
        LocationType locationType = parseLocationType(type);
        return locationRepository.findByCityAndType(city, locationType).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public List<LocationResponse> getLocationsByCountryOrderByCity(String country) {
        return locationRepository.findByCountryOrderByCity(country).stream()
                .map(locationMapper)
                .toList();
    }

    @Override
    public Long getLocationCountByType(String type) {
        LocationType locationType = parseLocationType(type);
        return locationRepository.countByType(locationType);
    }

    @Override
    public List<LocationResponse> getNearbyLocations(double latitude, double longitude, double radius) {
        return locationRepository.findNearbyLocations(latitude, longitude, radius).stream()
                .map(locationMapper)
                .toList();
    }

    private LocationType parseLocationType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new InvalidInputException("Location type cannot be empty");
        }
        try {
            return LocationType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid location type: " + type);
        }
    }
}
