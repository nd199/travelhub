package com.naren.backend.repository;

import com.naren.backend.entity.BoardingPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardingPointRepository extends JpaRepository<BoardingPoint, String> {
    List<BoardingPoint> findByLocationId(String locationId);
    List<BoardingPoint> findByType(com.naren.backend.entity.BoardingPointType type);
}
