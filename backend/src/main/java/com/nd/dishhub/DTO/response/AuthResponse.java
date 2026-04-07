package com.nd.dishhub.DTO.response;

import com.nd.dishhub.model.UserEntity;

public record AuthResponse(
    UserEntity user,
    String token
) {}
