package com.naren.backend.record;

import jakarta.validation.constraints.Email;

public record UserUpdateRequest(
        @Email(message = "Invalid email format")
        String email,

        String firstName,

        String lastName,

        String phoneNumber,

        String profileImageUrl,

        String gender,

        String roleId
) {
}
