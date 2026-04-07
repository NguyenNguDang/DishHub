package com.nd.dishhub.DTO.request;

public record RegisterRequest(
    String firstName,
    String lastName,
    String email,
    String password
) {}
