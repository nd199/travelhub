package com.naren.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "policies")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Policy {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "rules", columnDefinition = "TEXT")
    private String rules;

    @Column(name = "icon")
    private String icon;

    @Column(name = "policy_type", nullable = false)
    private String policyType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Manual getters to bypass Lombok issues
    public String getId() { return id; }
    public Vehicle getVehicle() { return vehicle; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRules() { return rules; }
    public String getIcon() { return icon; }
    public String getPolicyType() { return policyType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public void setId(String id) { this.id = id; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setRules(String rules) { this.rules = rules; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setPolicyType(String policyType) { this.policyType = policyType; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
