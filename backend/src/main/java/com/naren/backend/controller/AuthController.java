package com.naren.backend.controller;

import com.naren.backend.dto.UserResponse;
import com.naren.backend.record.LoginRequest;
import com.naren.backend.record.RegisterRequest;
import com.naren.backend.record.TokenRefreshRequest;
import com.naren.backend.service.UserService;
import com.naren.backend.util.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, 
                        UserService userService, 
                        JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.email());
        final String jwt = jwtUtil.generateToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        UserResponse user = userService.getUserByEmail(loginRequest.email());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("refreshToken", refreshToken);
        response.put("user", user);
        response.put("tokenType", "Bearer");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if user already exists
        if (userService.checkEmailExists(registerRequest.email())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Create new user - temporarily mock response
        Map<String, Object> mockUser = new HashMap<>();
        mockUser.put("id", "user123");
        mockUser.put("email", registerRequest.email());
        mockUser.put("firstName", registerRequest.firstName());
        mockUser.put("lastName", registerRequest.lastName());

        // Generate tokens
        final UserDetails userDetails = userService.loadUserByUsername(registerRequest.email());
        final String jwt = jwtUtil.generateToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("refreshToken", refreshToken);
        response.put("user", mockUser);
        response.put("tokenType", "Bearer");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String refreshToken = request.refreshToken();

        if (Objects.isNull(refreshToken) || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }

        if (!jwtUtil.isRefreshToken(refreshToken)) {
            return ResponseEntity.badRequest().body("Not a refresh token");
        }

        final String username = jwtUtil.extractUsername(refreshToken);
        final UserDetails userDetails = userService.loadUserByUsername(username);

        if (!jwtUtil.validateToken(refreshToken, userDetails)) {
            return ResponseEntity.badRequest().body("Refresh token expired");
        }

        final String newJwt = jwtUtil.generateToken(userDetails);
        final String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", newJwt);
        response.put("refreshToken", newRefreshToken);
        response.put("tokenType", "Bearer");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        if (Objects.isNull(authHeader) || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }

        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        final String username = jwtUtil.extractUsername(token);
        final UserResponse user = userService.getUserByEmail(username);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("valid", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In a real application, you might want to blacklist the token
        // For now, we just return success
        return ResponseEntity.ok("Logged out successfully");
    }
}
