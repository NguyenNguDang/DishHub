package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.UserUpdateRequest;
import com.nd.dishhub.DTO.response.UserResponse;
import com.nd.dishhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getByEmail(@PathVariable String email) {
        UserResponse response = userService.getByEmail(email);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAll(Pageable pageable) {
        try {
            Page<UserResponse> response = userService.getAll(pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = org.springframework.data.domain.PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<UserResponse> response = userService.getAll(pageable);
            return ResponseEntity.ok(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        userService.deactivate(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable Long id) {
        userService.activate(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        UserResponse response = userService.getByEmail(principal.getName());
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentProfile(
            Principal principal,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        UserResponse response = userService.updateCurrentProfile(principal.getName(), request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            Principal principal,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }
        
        String avatarUrl = userService.uploadAvatar(principal.getName(), file);
        Map<String, String> response = new HashMap<>();
        response.put("url", avatarUrl);
        return ResponseEntity.ok(response);
    }
}
