package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.response.AuthResponse;
import com.nd.dishhub.DTO.request.LoginRequest;
import com.nd.dishhub.DTO.request.RegisterRequest;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.security.JwtUtil;
import com.nd.dishhub.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email has already been taken!");
        }

        // Create a new user
        UserEntity user = new UserEntity();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setAge(request.age());
        user.setWeight(request.weight());
        user.setHeight(request.height());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        // Tạo token
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Xác thực
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Tạo token
        String token = jwtUtil.generateToken(authentication.getName());
        return new AuthResponse(token);
    }
}
