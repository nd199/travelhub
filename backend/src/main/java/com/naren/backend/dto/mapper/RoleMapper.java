package com.naren.backend.dto.mapper;

import com.naren.backend.entity.Role;
import com.naren.backend.dto.RoleResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class RoleMapper implements Function<Role, RoleResponse> {

    @Override
    public RoleResponse apply(Role role) {
        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getCreatedAt(),
                role.getUpdatedAt()
        );
    }
}
