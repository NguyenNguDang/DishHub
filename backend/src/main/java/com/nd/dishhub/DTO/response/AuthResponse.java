package com.nd.dishhub.DTO.response;

import com.nd.dishhub.DTO.UserDTO;

public record AuthResponse(
    UserDTO user,
    String token
) {}
