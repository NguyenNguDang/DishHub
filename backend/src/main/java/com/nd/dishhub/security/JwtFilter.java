package com.nd.dishhub.security;

import com.nd.dishhub.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    
    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        // Skip JWT validation cho public endpoints
        if (isPublicEndpoint(requestURI)) {
            chain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        
        // Kiểm tra authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            chain.doFilter(request, response);
            return;
        }
        
        // Kiểm tra prefix "Bearer "
        if (!authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        
        // Extract token và kiểm tra rỗng
        final String jwt = authHeader.substring(7).trim();
        if (jwt.isEmpty()) {
            chain.doFilter(request, response);
            return;
        }
        
        try {
            final String username = jwtUtil.extractUsername(jwt);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log lỗi JWT (có thể token bị expire hoặc invalid)
            System.err.println("JWT validation error: " + e.getMessage());
        }
        chain.doFilter(request, response);
    }
    
    /**
     * Kiểm tra xem request có phải public endpoint không
     */
    private boolean isPublicEndpoint(String requestURI) {
        String[] publicEndpoints = {
                "/v3/api-docs",
                "/swagger-ui",
                "/swagger-resources",
                "/api/v1/auth",
                "/api/v1/ingredients",
                "/error"
        };
        
        for (String endpoint : publicEndpoints) {
            if (requestURI.startsWith(endpoint)) {
                return true;
            }
        }
        return false;
    }
}