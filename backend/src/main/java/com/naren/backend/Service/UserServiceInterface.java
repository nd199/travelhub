package com.naren.backend.Service;

import com.naren.backend.DTO.UserResponse;
import com.naren.backend.Record.UserRequest;
import com.naren.backend.Record.UserUpdateRequest;

import java.util.List;

public interface UserServiceInterface {
    UserResponse createUser(UserRequest userRequest);
    UserResponse getUserById(String id);
    UserResponse getUserByEmail(String email);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(UserUpdateRequest userUpdateRequest);
    void deleteUser(String id);
    void changePassword(String email, String currentPassword, String newPassword);
}
