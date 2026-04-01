package com.naren.backend.Service.impl;

import com.naren.backend.DTO.UserResponse;
import com.naren.backend.DTO.mapper.UserMapper;
import com.naren.backend.Entity.Gender;
import com.naren.backend.Entity.Role;
import com.naren.backend.Entity.Users;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.UserRequest;

import com.naren.backend.Record.UserUpdateRequest;
import com.naren.backend.Repo.RoleRepository;
import com.naren.backend.Repo.UserRepository;
import com.naren.backend.Service.UserServiceInterface;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserServiceInterface {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        if(userRepository.existsByEmail(userRequest.email())) {
            throw new ResourceNotFoundException("User already exists with email: " + userRequest.email());
        }

        Users user = Users
                .builder()
                .firstName(userRequest.firstName())
                .lastName(userRequest.lastName())
                .email(userRequest.email())
                .password(passwordEncoder.encode(userRequest.password()))
                .build();

        Users savedUser = userRepository.save(user);
        return userMapper.apply(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        return userMapper.apply(userRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("User Not Found")
        ));
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userMapper.apply(userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User Not Found")
                ));
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found")
                        );

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
        }

        return userMapper.apply(user);
    }

    @Override
    public void deleteUser(String id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    public void changePassword(String email, String currentPassword, String newPassword) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private Gender parseGender(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            throw new IllegalArgumentException("Gender cannot be null or empty");
        }
        try {
            return Gender.valueOf(gender.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid gender: " + gender + ". Valid genders are: " + java.util.Arrays.toString(Gender.values()));
        }
    }
}
