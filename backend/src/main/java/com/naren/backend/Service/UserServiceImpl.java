package com.naren.backend.service;

import com.naren.backend.dto.UserResponse;
import com.naren.backend.dto.mapper.UserMapper;
import com.naren.backend.entity.Gender;
import com.naren.backend.entity.Role;
import com.naren.backend.entity.Users;
import com.naren.backend.exception.DuplicateResourceException;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.record.UserRequest;
import com.naren.backend.record.UserUpdateRequest;
import com.naren.backend.repository.RoleRepository;
import com.naren.backend.exception.AuthenticationException;
import com.naren.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new DuplicateResourceException("User already exists with email: " + userRequest.email());
        }

        Users user = Users.builder()
                .firstName(userRequest.firstName())
                .lastName(userRequest.lastName())
                .email(userRequest.email())
                .password(userRequest.password())
                .build();

        Users savedUser = userRepository.save(user);
        log.info("Created user {}", savedUser.getId());
        return userMapper.apply(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        return userMapper.apply(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userMapper.apply(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest userUpdateRequest) {
        Users user = userRepository.findByEmail(userUpdateRequest.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Objects.nonNull(userUpdateRequest.firstName()) &&
                !Objects.equals(userUpdateRequest.firstName(), user.getFirstName())) {
            user.setFirstName(userUpdateRequest.firstName());
        }

        if (Objects.nonNull(userUpdateRequest.lastName()) &&
                !Objects.equals(userUpdateRequest.lastName(), user.getLastName())) {
            user.setLastName(userUpdateRequest.lastName());
        }

        if (Objects.nonNull(userUpdateRequest.phoneNumber()) &&
                !Objects.equals(userUpdateRequest.phoneNumber(), user.getPhoneNumber())) {
            user.setPhoneNumber(userUpdateRequest.phoneNumber());
        }

        if (Objects.nonNull(userUpdateRequest.profileImageUrl()) &&
                !Objects.equals(userUpdateRequest.profileImageUrl(), user.getProfileImageUrl())) {
            user.setProfileImageUrl(userUpdateRequest.profileImageUrl());
        }

        if (Objects.nonNull(userUpdateRequest.gender())) {
            Gender gender = parseGender(userUpdateRequest.gender());
            if (!Objects.equals(gender, user.getGender())) {
                user.setGender(gender);
            }
        }

        if (Objects.nonNull(userUpdateRequest.roleId())) {
            Role role = roleRepository.findById(userUpdateRequest.roleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            if (!Objects.equals(role, user.getRole())) {
                user.setRole(role);
            }
        }

        userRepository.save(user);
        return userMapper.apply(user);
    }

    @Override
    public void deleteUser(String id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
        log.info("Deleted user {}", id);
    }

    @Override
    public void changePassword(String email, String currentPassword, String newPassword) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!currentPassword.equals(user.getPassword())) {
            log.warn("Failed password change attempt for user {}", email);
            throw new AuthenticationException("Current password is incorrect");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
        log.info("Password changed for user {}", email);
    }

    @Override
    public UserResponse getUserByPhoneNumber(String phoneNumber) {
        return userMapper.apply(userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findByRole(roleName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByGender(String gender) {
        Gender genderEnum = parseGender(gender);
        return userRepository.findByGender(genderEnum).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByFirstNameContaining(String firstName) {
        return userRepository.findByFirstNameContaining(firstName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByLastNameContaining(String lastName) {
        return userRepository.findByLastNameContaining(lastName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public Long getUserCountByRole(String roleName) {
        return userRepository.countByRoleName(roleName);
    }

    @Override
    public List<UserResponse> getUsersByActive(boolean active) {
        return userRepository.findByActive(active).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByCreatedDateRange(LocalDateTime start, LocalDateTime end) {
        return userRepository.findByCreatedAtBetween(start, end).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean checkPhoneNumberExists(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public UserResponse getActiveUserByEmail(String email) {
        return userMapper.apply(userRepository.findActiveUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Active user not found")));
    }

    @Override
    public Long getUserCountByRoleName(String roleName) {
        return userRepository.countByRoleName(roleName);
    }

    private Gender parseGender(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            throw new InvalidInputException("Gender cannot be null or empty");
        }
        try {
            return Gender.valueOf(gender.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid gender: " + gender);
        }
    }
}
