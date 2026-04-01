package com.naren.backend.Repo;

import com.naren.backend.Entity.Gender;
import com.naren.backend.Entity.Users;
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
    
    List<Users> findByRole(String roleName);
    
    List<Users> findByGender(Gender gender);
    
    List<Users> findByFirstNameContaining(String firstName);
    
    List<Users> findByLastNameContaining(String lastName);
    
    Long countByRole(String roleName);
    
    List<Users> findByActive(boolean active);
    
    List<Users> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    @Query("SELECT u FROM Users u WHERE u.email = :email AND u.active = true")
    Optional<Users> findActiveUserByEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(u) FROM Users u WHERE u.role.name = :roleName")
    Long countByRoleName(@Param("roleName") String roleName);
}
