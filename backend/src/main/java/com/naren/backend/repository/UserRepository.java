package com.naren.backend.repository;

import com.naren.backend.entity.Gender;
import com.naren.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    Optional<Users> findByEmail(String email);
    
    Optional<Users> findByPhoneNumber(String phoneNumber);
    
    @Query(value = "SELECT u FROM Users u WHERE u.role_name = :roleName", nativeQuery = true)
    List<Users> findByRole(@Param("roleName") String roleName);
    
    List<Users> findByGender(Gender gender);
    
    List<Users> findByFirstNameContaining(String firstName);
    
    List<Users> findByLastNameContaining(String lastName);
    
    Long countByRoleName(@Param("roleName") String roleName);
    
    List<Users> findByActive(boolean active);
    
    List<Users> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    @Query(value = "SELECT u FROM Users u WHERE u.email = :email AND u.active = true", nativeQuery = true)
    Optional<Users> findActiveUserByEmail(@Param("email") String email);
}
