package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.UserUpdateRequest;
import com.nd.dishhub.DTO.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse getByEmail(String email);

    Page<UserResponse> getAll(Pageable pageable);

    UserResponse update(Long id, UserUpdateRequest request);

    void delete(Long id);

    void deactivate(Long id);

    void activate(Long id);
}

