package com.naren.backend.service;

import com.naren.backend.dto.PolicyResponse;
import com.naren.backend.entity.Policy;
import com.naren.backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyService {

    private final PolicyRepository policyRepository;
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PolicyService.class);

    public List<PolicyResponse> getPoliciesByVehicle(String vehicleId) {
        log.info("Fetching policies for vehicle: {}", vehicleId);
        List<Policy> policies = policyRepository.findByVehicleId(vehicleId);
        return policies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private PolicyResponse convertToResponse(Policy policy) {
        return new PolicyResponse(
                policy.getId(),
                policy.getVehicle().getId(),
                policy.getTitle(),
                policy.getDescription(),
                policy.getRules().split("\n"),
                policy.getIcon(),
                policy.getPolicyType(),
                policy.getCreatedAt()
        );
    }
}
