package com.naren.backend.repository;

import com.naren.backend.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findByVehicleId(String vehicleId);
    List<Policy> findByPolicyType(String policyType);
}
