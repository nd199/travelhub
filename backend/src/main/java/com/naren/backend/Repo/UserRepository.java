package com.naren.backend.Repo;

import com.naren.backend.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);
}
