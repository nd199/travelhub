package com.naren.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "boarding_points")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardingPoint {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "point_name", nullable = false)
    private String pointName;

    @Column(name = "address")
    private String address;

    @Column(name = "time")
    private String time;

    @Column(name = "landmark")
    private String landmark;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private BoardingPointType type;

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
    public Location getLocation() { return location; }
    public String getPointName() { return pointName; }
    public String getAddress() { return address; }
    public String getTime() { return time; }
    public String getLandmark() { return landmark; }
    public BoardingPointType getType() { return type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public void setId(String id) { this.id = id; }
    public void setLocation(Location location) { this.location = location; }
    public void setPointName(String pointName) { this.pointName = pointName; }
    public void setAddress(String address) { this.address = address; }
    public void setTime(String time) { this.time = time; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public void setType(BoardingPointType type) { this.type = type; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
