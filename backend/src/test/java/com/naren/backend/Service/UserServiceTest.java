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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;

    private UserServiceImpl underTest;

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