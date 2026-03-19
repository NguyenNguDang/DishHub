package com.nd.dishhub.service;

import com.nd.dishhub.DTO.response.AuthResponse;
import com.nd.dishhub.DTO.request.LoginRequest;
import com.nd.dishhub.DTO.request.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
