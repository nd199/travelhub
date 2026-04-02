package com.naren.backend.service;

import com.naren.backend.dto.UserResponse;
import com.naren.backend.dto.mapper.UserMapper;
import com.naren.backend.entity.Gender;
import com.naren.backend.entity.Users;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.record.UserRequest;
import com.naren.backend.repository.RoleRepository;
import com.naren.backend.repository.UserRepository;
import com.naren.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserServiceInterfaceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;

    private UserServiceInterface underTest;

    @BeforeEach
    void setUp() {
        underTest = new UserServiceImpl(
                userRepository,
                roleRepository,
                userMapper
        );
    }

    @Test
    void createUserWithUserPresentThrows() {
        String email = "test@email.com";
        UserRequest userRequest = new UserRequest(
                email, "password",
                "John", "Cena",
                "0987654321", "",
                Gender.MALE,
                ""
        );
        when(userRepository.existsByEmail(email)).thenReturn(true);

        assertThatThrownBy(() -> underTest.createUser(userRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User already exists with email: " + userRequest.email());
    }

    @Test
    void createUserRunsFineWhenUserNotPresent() {
        String email = "test@email.com";
        UserRequest userRequest = new UserRequest(
                email, "password",
                "John", "Cena",
                "0987654321", "",
                Gender.MALE,
                ""
        );
        when(userRepository.existsByEmail(email)).thenReturn(false);
        
        Users savedUser = Users.builder()
                .id("123")
                .email(email)
                .firstName("John")
                .lastName("Cena")
                .phoneNumber("0987654321")
                .profileImageUrl("")
                .gender(Gender.MALE)
                .build();
        
        UserResponse expectedResponse = new UserResponse(
                "123", email, "John", "Cena",
                "0987654321", "", Gender.MALE,
                "", null, null
        );
        
        when(userRepository.save(org.mockito.ArgumentMatchers.any(Users.class))).thenReturn(savedUser);
        when(userMapper.apply(savedUser)).thenReturn(expectedResponse);

        UserResponse userResponse = underTest.createUser(userRequest);

        ArgumentCaptor<Users> usersArgumentCaptor = ArgumentCaptor.forClass(Users.class);
        verify(userRepository).save(usersArgumentCaptor.capture());

        Users capturedUser = usersArgumentCaptor.getValue();
        assertEquals(capturedUser.getEmail(), userResponse.email());
        assertEquals(capturedUser.getFirstName(), userResponse.firstName());
        assertEquals(capturedUser.getLastName(), userResponse.lastName());
        assertEquals(capturedUser.getPhoneNumber(), userResponse.phoneNumber());
        assertEquals(capturedUser.getProfileImageUrl(), userResponse.profileImageUrl());
        assertEquals(capturedUser.getGender(), userResponse.gender());
        assertEquals(capturedUser.getRole().getId(), userResponse.roleId());
    }

    @Test
    void getUserById() {
        String id = "123";
    }

    @Test
    void getUserByEmail() {
    }

    @Test
    void getAllUsers() {
    }

    @Test
    void updateUser() {
    }

    @Test
    void deleteUser() {
    }

    @Test
    void changePassword() {
    }
}
