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
import com.naren.backend.service.UserServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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
        logger.info("Creating user with email: {}", userRequest.email());
        if(userRepository.existsByEmail(userRequest.email())) {
            logger.error("User already exists with email: {}", userRequest.email());
            throw new DuplicateResourceException("User already exists with email: " + userRequest.email());
        }

        Users user = Users
                .builder()
                .firstName(userRequest.firstName())
                .lastName(userRequest.lastName())
                .email(userRequest.email())
                .password(userRequest.password())
                .build();

        Users savedUser = userRepository.save(user);
        logger.info("User created successfully with id: {}", savedUser.getId());
        return userMapper.apply(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        logger.info("Fetching user by id: {}", id);
        return userMapper.apply(userRepository.findById(id).orElseThrow(
                ()-> {
                    logger.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User Not Found");
                }
        ));
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userMapper.apply(userRepository.findByEmail(email)
                .orElseThrow(
                        () -> {
                            logger.error("User not found with email: {}", email);
                            return new ResourceNotFoundException("User Not Found");
                        }
                ));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        logger.info("Fetching all users");
        List<UserResponse> users = userRepository.findAll().stream()
                .map(userMapper)
                .toList();
        logger.info("Retrieved {} users", users.size());
        return users;
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest userUpdateRequest) {
        logger.info("Updating user with email: {}", userUpdateRequest.email());

        Users user = userRepository.findByEmail(userUpdateRequest.email())
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", userUpdateRequest.email());
                    return new ResourceNotFoundException("User not found");
                });

        boolean needsUpdate = false;

        if(Objects.nonNull(userUpdateRequest.firstName()) &&
                ! Objects.equals(userUpdateRequest.firstName(), user.getFirstName())) {
            user.setFirstName(userUpdateRequest.firstName());
            needsUpdate = true;
        }

        if(Objects.nonNull(userUpdateRequest.lastName()) &&
           !Objects.equals(userUpdateRequest.lastName(), user.getLastName())) {
            user.setLastName(userUpdateRequest.lastName());
            needsUpdate = true;
        }

        if(Objects.nonNull(userUpdateRequest.phoneNumber()) &&
           !Objects.equals(userUpdateRequest.phoneNumber(), user.getPhoneNumber())) {
            user.setPhoneNumber(userUpdateRequest.phoneNumber());
            needsUpdate = true;
        }

        if(Objects.nonNull(userUpdateRequest.profileImageUrl()) &&
           !Objects.equals(userUpdateRequest.profileImageUrl(), user.getProfileImageUrl())) {
            user.setProfileImageUrl(userUpdateRequest.profileImageUrl());
            needsUpdate = true;
        }

        if(Objects.nonNull(userUpdateRequest.gender())) {
            Gender gender = parseGender(userUpdateRequest.gender());
            if(!Objects.equals(gender, user.getGender())) {
                user.setGender(gender);
                needsUpdate = true;
            }
        }

        if(Objects.nonNull(userUpdateRequest.roleId())) {
            Role role = roleRepository.findById(userUpdateRequest.roleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            if(!Objects.equals(role, user.getRole())) {
                user.setRole(role);
                needsUpdate = true;
            }
        }

        if(needsUpdate) {
            userRepository.save(user);
            logger.info("User updated successfully: {}", userUpdateRequest.email());
        } else {
            logger.info("No changes detected for user: {}", userUpdateRequest.email());
        }

        return userMapper.apply(user);
    }

    @Override
    public void deleteUser(String id) {
        logger.info("Deleting user with id: {}", id);
        Users user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });
        userRepository.delete(user);
        logger.info("User deleted successfully with id: {}", id);
    }

    @Override
    public void changePassword(String email, String currentPassword, String newPassword) {
        logger.info("Changing password for user with email: {}", email);
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });
        
        if (!currentPassword.equals(user.getPassword())) {
            logger.error("Current password is incorrect for user: {}", email);
            throw new AuthenticationException("Current password is incorrect");
        }
        
        user.setPassword(newPassword);
        userRepository.save(user);
        logger.info("Password changed successfully for user: {}", email);
    }

    @Override
    public UserResponse getUserByPhoneNumber(String phoneNumber) {
        logger.info("Fetching user by phone number: {}", phoneNumber);
        return userMapper.apply(userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(
                        () -> {
                            logger.error("User not found with phone number: {}", phoneNumber);
                            return new ResourceNotFoundException("User Not Found");
                        }
                ));
    }

    @Override
    public List<UserResponse> getUsersByRole(String roleName) {
        logger.info("Fetching users by role: {}", roleName);
        return userRepository.findByRole(roleName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByGender(String gender) {
        logger.info("Fetching users by gender: {}", gender);
        Gender genderEnum = parseGender(gender);
        return userRepository.findByGender(genderEnum).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByFirstNameContaining(String firstName) {
        logger.info("Fetching users by first name containing: {}", firstName);
        return userRepository.findByFirstNameContaining(firstName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByLastNameContaining(String lastName) {
        logger.info("Fetching users by last name containing: {}", lastName);
        return userRepository.findByLastNameContaining(lastName).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public Long getUserCountByRole(String roleName) {
        logger.info("Getting user count by role: {}", roleName);
        return userRepository.countByRoleName(roleName);
    }

    @Override
    public List<UserResponse> getUsersByActive(boolean active) {
        logger.info("Fetching users by active status: {}", active);
        return userRepository.findByActive(active).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByCreatedDateRange(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching users by created date range: {} to {}", start, end);
        return userRepository.findByCreatedAtBetween(start, end).stream()
                .map(userMapper)
                .toList();
    }

    @Override
    public boolean checkEmailExists(String email) {
        logger.info("Checking if email exists: {}", email);
        boolean exists = userRepository.existsByEmail(email);
        logger.debug("Email {} exists: {}", email, exists);
        return exists;
    }

    @Override
    public boolean checkPhoneNumberExists(String phoneNumber) {
        logger.info("Checking if phone number exists: {}", phoneNumber);
        boolean exists = userRepository.existsByPhoneNumber(phoneNumber);
        logger.debug("Phone number {} exists: {}", phoneNumber, exists);
        return exists;
    }

    @Override
    public UserResponse getActiveUserByEmail(String email) {
        logger.info("Fetching active user by email: {}", email);
        return userMapper.apply(userRepository.findActiveUserByEmail(email)
                .orElseThrow(
                        () -> {
                            logger.error("Active user not found with email: {}", email);
                            return new ResourceNotFoundException("Active User Not Found");
                        }
                ));
    }

    @Override
    public Long getUserCountByRoleName(String roleName) {
        logger.info("Getting user count by role name: {}", roleName);
        return userRepository.countByRoleName(roleName);
    }

    private Gender parseGender(String gender) {
        logger.debug("Parsing gender: {}", gender);
        if (gender == null || gender.trim().isEmpty()) {
            logger.error("Gender cannot be null or empty");
            throw new InvalidInputException("Gender cannot be null or empty");
        }
        try {
            Gender result = Gender.valueOf(gender.trim().toUpperCase());
            logger.debug("Parsed gender: {}", result);
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid gender: {}", gender);
            throw new InvalidInputException("Invalid gender: " + gender + ". Valid genders are: " + java.util.Arrays.toString(Gender.values()));
        }
    }
}
