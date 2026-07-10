package com.naren.backend.service;

import com.naren.backend.record.LoginRequest;
import com.naren.backend.record.RegisterRequest;
import com.naren.backend.record.TokenRefreshRequest;
import com.naren.backend.dto.UserResponse;
import com.naren.backend.entity.Users;
import com.naren.backend.exception.AuthenticationException;
import com.naren.backend.exception.DuplicateResourceException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.repository.UserRepository;
import com.naren.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserResponse login(LoginRequest request) {
        logger.debug("Attempting login for email: {}", request.email());
        
        try {
            Users user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new AuthenticationException("User not found: " + request.email()));
            
            if (!passwordEncoder.matches(request.password(), user.getPassword())) {
                throw new AuthenticationException("Invalid credentials");
            }
            
            String[] tokens = generateTokens(user);
            logger.info("Login successful for email: {}", request.email());
            return mapToUserResponse(user, buildTokenClaims(tokens[0], tokens[1]));
            
        } catch (AuthenticationException e) {
            logger.warn("Login failed for email: {}", request.email(), e);
            throw e;
        } catch (Exception e) {
            logger.warn("Login failed for email: {}", request.email(), e);
            throw new AuthenticationException("Login failed", e);
        }
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        logger.debug("Attempting registration for email: {}", request.email());
        
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists: " + request.email());
        }
        
        Users user = new Users();
        user.setId(java.util.UUID.randomUUID().toString());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setActive(true);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        Users savedUser = userRepository.save(user);
        
        String[] tokens = generateTokens(savedUser);
        logger.info("Registration successful for email: {}", request.email());
        return mapToUserResponse(savedUser, buildTokenClaims(tokens[0], tokens[1]));
    }

    @Override
    public UserResponse refreshToken(TokenRefreshRequest request) {
        logger.debug("Attempting token refresh");
        
        try {
            String refreshToken = request.refreshToken();
            String username = jwtUtil.extractUsername(refreshToken);
            
            Users user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
            
            if (jwtUtil.validateToken(refreshToken, buildUserDetails(user))) {
                String[] tokens = generateTokens(user);
                logger.info("Token refresh successful for user: {}", username);
                return mapToUserResponse(user, buildTokenClaims(tokens[0], tokens[1]));
            } else {
                throw new AuthenticationException("Invalid refresh token");
            }
            
        } catch (AuthenticationException e) {
            logger.warn("Token refresh failed", e);
            throw e;
        } catch (Exception e) {
            logger.warn("Token refresh failed", e);
            throw new AuthenticationException("Token refresh failed", e);
        }
    }

    @Override
    public boolean verifyToken(String token) {
        logger.debug("Verifying token");
        
        try {
            String username = jwtUtil.extractUsername(token);
            Users user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
            
            return jwtUtil.validateToken(token, buildUserDetails(user));
        } catch (Exception e) {
            logger.debug("Token verification failed", e);
            return false;
        }
    }

    @Override
    public void logout(String token) {
        logger.info("User logout");
        // In a real implementation, you might want to blacklist the token
        // For now, we'll just log the logout
    }

    @Override
    public UserResponse getCurrentUser(String token) {
        logger.debug("Getting current user from token");
        
        try {
            String username = jwtUtil.extractUsername(token);
            Users user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
            
            if (jwtUtil.validateToken(token, buildUserDetails(user))) {
                return mapToUserResponse(user, new HashMap<>());
            } else {
                throw new AuthenticationException("Invalid token");
            }
        } catch (AuthenticationException e) {
            logger.warn("Failed to get current user", e);
            throw e;
        } catch (Exception e) {
            logger.warn("Failed to get current user", e);
            throw new AuthenticationException("Failed to get current user", e);
        }
    }

    private org.springframework.security.core.userdetails.UserDetails buildUserDetails(Users user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(() -> "ROLE_USER"))
                .build();
    }

    private String[] generateTokens(Users user) {
        org.springframework.security.core.userdetails.UserDetails userDetails = buildUserDetails(user);
        return new String[] {
            jwtUtil.generateToken(userDetails),
            jwtUtil.generateRefreshToken(userDetails)
        };
    }

    private Map<String, Object> buildTokenClaims(String accessToken, String refreshToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "Bearer");
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);
        return claims;
    }

    private UserResponse mapToUserResponse(Users user, Map<String, Object> additionalClaims) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getProfileImageUrl(),
                user.getGender(),
                Objects.nonNull(user.getRole()) ? user.getRole().getName() : null,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
