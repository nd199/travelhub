package com.naren.backend.Service;

import com.naren.backend.Record.LocationResponse;
import com.naren.backend.DTO.mapper.LocationMapper;
import com.naren.backend.Entity.Location;
import com.naren.backend.Entity.LocationType;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.LocationRequest;
import com.naren.backend.Repo.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public LocationResponse createLocation(LocationRequest locationRequest) {
        Location location = Location
                .builder()
                .name(locationRequest.name())
                .city(locationRequest.city())
                .state(locationRequest.state())
                .country(locationRequest.country())
                .latitude(locationRequest.latitude())
                .longitude(locationRequest.longitude())
                .type(LocationType.valueOf(locationRequest.type().toUpperCase()))
                .address(locationRequest.address())
                .pincode(locationRequest.pincode())
                .build();

        Location savedLocation = locationRepository.save(location);
        return locationMapper.apply(savedLocation);
    }

    public LocationResponse getLocationById(String id) {
        return locationMapper.apply(locationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Location Not Found")
        ));
    }

    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(locationMapper)
                .toList();
    }

    public List<LocationResponse> getLocationsByCity(String city) {
        return locationRepository.findByCity(city).stream()
                .map(locationMapper)
                .toList();
    }

    public List<LocationResponse> getLocationsByCountry(String country) {
        return locationRepository.findByCountry(country).stream()
                .map(locationMapper)
                .toList();
    }

    public List<LocationResponse> getLocationsByType(String type) {
        LocationType locationType = LocationType.valueOf(type.toUpperCase());
        return locationRepository.findByType(locationType).stream()
                .map(locationMapper)
                .toList();
    }

    public List<LocationResponse> getLocationsByCityAndCountry(String city, String country) {
        return locationRepository.findByCityAndCountry(city, country).stream()
                .map(locationMapper)
                .toList();
    }

    public LocationResponse updateLocation(String id, LocationRequest locationRequest) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));

        boolean needsUpdate = false;

        if(Objects.nonNull(locationRequest.name()) &&
                !Objects.equals(locationRequest.name(), location.getName())) {
            location.setName(locationRequest.name());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.city()) &&
                !Objects.equals(locationRequest.city(), location.getCity())) {
            location.setCity(locationRequest.city());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.state()) &&
                !Objects.equals(locationRequest.state(), location.getState())) {
            location.setState(locationRequest.state());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.country()) &&
                !Objects.equals(locationRequest.country(), location.getCountry())) {
            location.setCountry(locationRequest.country());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.latitude()) &&
                !Objects.equals(locationRequest.latitude(), location.getLatitude())) {
            location.setLatitude(locationRequest.latitude());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.longitude()) &&
                !Objects.equals(locationRequest.longitude(), location.getLongitude())) {
            location.setLongitude(locationRequest.longitude());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.type())) {
            LocationType type = LocationType.valueOf(locationRequest.type().toUpperCase());
            if(!Objects.equals(type, location.getType())) {
                location.setType(type);
                needsUpdate = true;
            }
        }

        if(Objects.nonNull(locationRequest.address()) &&
                !Objects.equals(locationRequest.address(), location.getAddress())) {
            location.setAddress(locationRequest.address());
            needsUpdate = true;
        }

        if(Objects.nonNull(locationRequest.pincode()) &&
                !Objects.equals(locationRequest.pincode(), location.getPincode())) {
            location.setPincode(locationRequest.pincode());
            needsUpdate = true;
        }

        if(needsUpdate) {
            locationRepository.save(location);
        }

        return locationMapper.apply(location);
    }

    public void deleteLocation(String id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        locationRepository.delete(location);
    }
}
