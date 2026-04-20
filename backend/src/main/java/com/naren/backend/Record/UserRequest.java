package com.naren.backend.record;

public record UserRequest(
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    String profileImageUrl,
    String gender,
    String roleId
) {
}
