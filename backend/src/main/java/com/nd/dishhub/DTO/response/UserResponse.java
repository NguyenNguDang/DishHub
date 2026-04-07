package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;
    
    private String username;

    private int age;

    private float weight;

    private float height;

    private String email;

    private boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

