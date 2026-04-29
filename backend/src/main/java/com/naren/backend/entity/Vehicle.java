package com.naren.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vehicle {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private VehicleType type;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "amenities")
    private String amenities;

    @Column(name = "bus_kind")
    private String busKind;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "reviews")
    private Integer reviews;

    @Column(name = "peoples_choice")
    private String peoplesChoice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VehicleStatus status;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviewList;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Policy> policies;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BusPhoto> photos;

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
    public String getName() { return name; }
    public VehicleType getType() { return type; }
    public Integer getCapacity() { return capacity; }
    public String getAmenities() { return amenities; }
    public String getBusKind() { return busKind; }
    public Double getRating() { return rating; }
    public Integer getReviews() { return reviews; }
    public String getPeoplesChoice() { return peoplesChoice; }
    public VehicleStatus getStatus() { return status; }
    public String getRegistrationNumber() { return registrationNumber; }
    public List<Seat> getSeats() { return seats; }
    public List<Schedule> getSchedules() { return schedules; }
    public List<Review> getReviewList() { return reviewList; }
    public List<Policy> getPolicies() { return policies; }
    public List<BusPhoto> getPhotos() { return photos; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(VehicleType type) { this.type = type; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
    public void setBusKind(String busKind) { this.busKind = busKind; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }
    public void setPeoplesChoice(String peoplesChoice) { this.peoplesChoice = peoplesChoice; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }
    public void setSchedules(List<Schedule> schedules) { this.schedules = schedules; }
    public void setReviewList(List<Review> reviewList) { this.reviewList = reviewList; }
    public void setPolicies(List<Policy> policies) { this.policies = policies; }
    public void setPhotos(List<BusPhoto> photos) { this.photos = photos; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
