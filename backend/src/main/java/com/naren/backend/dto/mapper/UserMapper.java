package com.naren.backend.dto.mapper;

import com.naren.backend.entity.Users;
import com.naren.backend.dto.UserResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class UserMapper implements Function<Users, UserResponse> {

    @Override
    public UserResponse apply(Users user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getProfileImageUrl(),
                user.getGender() != null ? user.getGender() : null,
                user.getRole().getId(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
