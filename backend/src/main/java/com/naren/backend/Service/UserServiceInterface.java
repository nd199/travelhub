package com.naren.backend.service;

import com.naren.backend.dto.UserResponse;
import com.naren.backend.record.UserRequest;
import com.naren.backend.record.UserUpdateRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface UserServiceInterface {
    UserResponse createUser(UserRequest userRequest);
    UserResponse getUserById(String id);
    UserResponse getUserByEmail(String email);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(UserUpdateRequest userUpdateRequest);
    void deleteUser(String id);
    void changePassword(String email, String currentPassword, String newPassword);
    
    UserResponse getUserByPhoneNumber(String phoneNumber);
    List<UserResponse> getUsersByRole(String roleName);
    List<UserResponse> getUsersByGender(String gender);
    List<UserResponse> getUsersByFirstNameContaining(String firstName);
    List<UserResponse> getUsersByLastNameContaining(String lastName);
    Long getUserCountByRole(String roleName);
    List<UserResponse> getUsersByActive(boolean active);
    List<UserResponse> getUsersByCreatedDateRange(LocalDateTime start, LocalDateTime end);
    boolean checkEmailExists(String email);
    boolean checkPhoneNumberExists(String phoneNumber);
    UserResponse getActiveUserByEmail(String email);
    Long getUserCountByRoleName(String roleName);
}
