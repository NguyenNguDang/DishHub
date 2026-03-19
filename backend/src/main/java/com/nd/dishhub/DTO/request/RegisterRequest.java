package com.nd.dishhub.DTO.request;

public record RegisterRequest(
    String firstName,
    String lastName,
    int age,
    float weight,
    float height,
    String email,
    String password
) {}
