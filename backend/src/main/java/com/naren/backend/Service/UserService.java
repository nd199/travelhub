package com.naren.backend.service;

import com.naren.backend.record.UserRequest;
import com.naren.backend.dto.UserResponse;
import com.naren.backend.record.UserUpdateRequest;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
import java.util.Map;

public interface UserService extends UserDetailsService {
    
    UserResponse createUser(UserRequest request);
    
    UserResponse getUserById(String id);
    
    UserResponse getUserByEmail(String email);
    
    List<UserResponse> getAllUsers();
    
    UserResponse updateUser(UserUpdateRequest request);
    
    void deleteUser(String id);
    
    List<UserResponse> getUsersByRole(String role);
    
    List<UserResponse> getUsersByActive(boolean active);
    
    boolean checkEmailExists(String email);
    
    UserResponse getUserProfile(Long userId);
    
    UserResponse updateUserProfile(Long userId, UserUpdateRequest request);
    
    void changePassword(Long userId, String oldPassword, String newPassword);
    
    UserResponse uploadProfilePicture(Long userId, String pictureUrl);
    
    Map<String, Object> getUserPreferences(Long userId);
    
    UserResponse updateUserPreferences(Long userId, Map<String, Object> preferences);
}