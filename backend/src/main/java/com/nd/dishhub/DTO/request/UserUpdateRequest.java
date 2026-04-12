package com.nd.dishhub.DTO.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Min(value = 0, message = "Age must be greater than or equal to 0")
    private Integer age;

    @Min(value = 0, message = "Weight must be greater than or equal to 0")
    private Float weight;

    @Min(value = 0, message = "Height must be greater than or equal to 0")
    private Float height;
}

