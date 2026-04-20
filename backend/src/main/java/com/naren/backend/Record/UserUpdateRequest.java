package com.naren.backend.record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    String firstName,
    
    String lastName,
    
    String phoneNumber,
    
    String profileImageUrl,
    
    String gender,
    
    String roleId
) {}
