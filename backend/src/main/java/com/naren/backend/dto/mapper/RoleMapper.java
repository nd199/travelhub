package com.naren.backend.DTO.mapper;

import com.naren.backend.Entity.Role;
import com.naren.backend.Record.RoleResponse;
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
