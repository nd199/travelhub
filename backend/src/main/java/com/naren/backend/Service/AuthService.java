package com.naren.backend.service;

import com.naren.backend.record.LoginRequest;
import com.naren.backend.record.RegisterRequest;
import com.naren.backend.record.TokenRefreshRequest;
import com.naren.backend.dto.UserResponse;

public interface AuthService {
    
    UserResponse login(LoginRequest request);
    
    UserResponse register(RegisterRequest request);
    
    UserResponse refreshToken(TokenRefreshRequest request);
    
    boolean verifyToken(String token);
    
    void logout(String token);
    
    UserResponse getCurrentUser(String token);
}