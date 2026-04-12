package com.nd.dishhub.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private int age;

    private float weight;

    private float height;

    private String avatarUrl;

    private boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

