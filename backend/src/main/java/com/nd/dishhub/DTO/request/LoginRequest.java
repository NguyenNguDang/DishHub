package com.nd.dishhub.DTO.request;

public record LoginRequest(
    String email,
    String password
) {}
