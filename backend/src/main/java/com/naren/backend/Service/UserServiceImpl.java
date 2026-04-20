package com.naren.backend.service;

import com.naren.backend.record.UserRequest;
import com.naren.backend.dto.UserResponse;
import com.naren.backend.record.UserUpdateRequest;
import com.naren.backend.entity.Users;
import com.naren.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        // Simple implementation for testing
        return null;
    }

    @Override
    public UserResponse getUserById(String id) {
        return userRepository.findById(id)
                .map(this::mapToUserResponse)
                .orElse(null);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::mapToUserResponse)
                .orElse(null);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest request) {
        return null;
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserResponse> getUsersByRole(String role) {
        return List.of();
    }

    @Override
    public List<UserResponse> getUsersByActive(boolean active) {
        return List.of();
    }

    @Override
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserResponse getUserProfile(Long userId) {
        return null;
    }

    @Override
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        return null;
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
    }

    @Override
    public UserResponse uploadProfilePicture(Long userId, String pictureUrl) {
        return null;
    }

    @Override
    public Map<String, Object> getUserPreferences(Long userId) {
        return Map.of();
    }

    @Override
    public UserResponse updateUserPreferences(Long userId, Map<String, Object> preferences) {
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(() -> "ROLE_USER"))
                .build();
    }

    private UserResponse mapToUserResponse(Users user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getProfileImageUrl(),
                user.getGender(),
                user.getRole() != null ? user.getRole().getName() : null,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
