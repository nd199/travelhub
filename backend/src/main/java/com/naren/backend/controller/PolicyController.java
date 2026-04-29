package com.naren.backend.controller;

import com.naren.backend.dto.PolicyResponse;
import com.naren.backend.service.PolicyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@Tag(name = "Policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<PolicyResponse>> getPoliciesByVehicle(@PathVariable String vehicleId) {
        return ResponseEntity.ok(policyService.getPoliciesByVehicle(vehicleId));
    }
}
