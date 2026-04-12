package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.UserUpdateRequest;
import com.nd.dishhub.DTO.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse getByEmail(String email);

    Page<UserResponse> getAll(Pageable pageable);

    UserResponse update(Long id, UserUpdateRequest request);

    void delete(Long id);

    void deactivate(Long id);

    void activate(Long id);

    /**
     * Cập nhật profile của user hiện tại (lấy từ JWT)
     */
    UserResponse updateCurrentProfile(String email, UserUpdateRequest request);

    /**
     * Upload avatar cho user
     */
    String uploadAvatar(String email, MultipartFile file);
}

