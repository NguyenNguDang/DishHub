package com.nd.dishhub.service;

import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch user từ DB
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + email));
        
        // Trả về đối tượng UserDetails của Spring Security
        return new User(
                user.getEmail(),
                user.getPasswordHash(),
                new ArrayList<>() // Danh sách quyền (Roles/Authorities), để trống nếu chưa làm phân quyền
        );
    }
}
