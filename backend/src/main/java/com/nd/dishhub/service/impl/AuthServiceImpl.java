package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.UserDTO;
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
        String email = request.email().toLowerCase().trim();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email has already been taken!");
        }

        // Create a new user
        UserEntity user = new UserEntity();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        // Tạo token
        String token = jwtUtil.generateToken(user.getEmail());
        UserDTO userDTO = convertToDTO(user);
        return new AuthResponse(userDTO, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase().trim();

        // Xác thực
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password())
        );

        // Lấy user từ database
        UserEntity user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo token
        String token = jwtUtil.generateToken(user.getEmail());
        UserDTO userDTO = convertToDTO(user);
        return new AuthResponse(userDTO, token);
    }

    private UserDTO convertToDTO(UserEntity user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .age(user.getAge())
                .weight(user.getWeight())
                .height(user.getHeight())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
