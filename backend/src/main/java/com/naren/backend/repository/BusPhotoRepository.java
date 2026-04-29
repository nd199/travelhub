package com.naren.backend.repository;

import com.naren.backend.entity.BusPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusPhotoRepository extends JpaRepository<BusPhoto, String> {
    List<BusPhoto> findByVehicleId(String vehicleId);
    List<BusPhoto> findByVehicleIdOrderByDisplayOrderAsc(String vehicleId);
    List<BusPhoto> findByVehicleIdAndIsPrimaryTrue(String vehicleId);
}
