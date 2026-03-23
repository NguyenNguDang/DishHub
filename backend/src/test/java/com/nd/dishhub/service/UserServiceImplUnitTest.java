package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.UserUpdateRequest;
import com.nd.dishhub.DTO.response.UserResponse;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
@Transactional
class UserServiceImplUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserEntity testUserEntity;
    private UserUpdateRequest validUpdateRequest;
    private UserResponse expectedResponse;

    @BeforeEach
    void setUp() {
        testUserEntity = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(true)
                .build();
        testUserEntity.setId(1L);
        testUserEntity.setCreatedAt(LocalDateTime.now());
        testUserEntity.setUpdatedAt(LocalDateTime.now());

        validUpdateRequest = UserUpdateRequest.builder()
                .firstName("Jane")
                .lastName("Smith")
                .age(28)
                .weight(65.0f)
                .height(170.0f)
                .build();

        expectedResponse = UserResponse.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .age(30)
                .weight(75.5f)
                .height(180.0f)
                .email("test@example.com")
                .isActive(true)
                .createdAt(testUserEntity.getCreatedAt())
                .updatedAt(testUserEntity.getUpdatedAt())
                .build();
    }

    // ==================== GETBYID TESTS ====================

    @Test
    @DisplayName("getById_ValidId_ReturnsUser")
    void testGetById_ValidId_ReturnsUser() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));

        // Act
        UserResponse result = userService.getById(userId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getEmail(), result.getEmail());
        assertEquals(expectedResponse.getFirstName(), result.getFirstName());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("getById_NonExistentId_ThrowsException")
    void testGetById_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getById(nonExistentId);
        });
        verify(userRepository, times(1)).findById(nonExistentId);
    }

    // ==================== GETBYEMAIL TESTS ====================

    @Test
    @DisplayName("getByEmail_ValidEmail_ReturnsUser")
    void testGetByEmail_ValidEmail_ReturnsUser() {
        // Arrange
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserEntity));

        // Act
        UserResponse result = userService.getByEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals(expectedResponse.getFirstName(), result.getFirstName());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("getByEmail_NonExistentEmail_ThrowsException")
    void testGetByEmail_NonExistentEmail_ThrowsException() {
        // Arrange
        String nonExistentEmail = "nonexistent@example.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getByEmail(nonExistentEmail);
        });
        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    // ==================== GETALL TESTS ====================

    @Test
    @DisplayName("getAll_ValidPagination_ReturnsPageOfUsers")
    void testGetAll_ValidPagination_ReturnsPageOfUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<UserEntity> users = new ArrayList<>();
        users.add(testUserEntity);

        UserEntity user2 = UserEntity.builder()
                .email("user2@example.com")
                .firstName("Alice")
                .lastName("Brown")
                .passwordHash("hashed_password")
                .Age(25)
                .Weight(60.0f)
                .Height(165.0f)
                .isActive(true)
                .build();
        user2.setId(2L);
        users.add(user2);

        Page<UserEntity> pageResult = new PageImpl<>(users, pageable, 2);
        when(userRepository.findAll(pageable)).thenReturn(pageResult);

        // Act
        Page<UserResponse> result = userService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        verify(userRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("getAll_EmptyResult_ReturnsEmptyPage")
    void testGetAll_EmptyResult_ReturnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<UserEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);
        when(userRepository.findAll(pageable)).thenReturn(emptyPage);

        // Act
        Page<UserResponse> result = userService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
        assertTrue(result.isEmpty());
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("update_ValidInput_ReturnsUpdated")
    void testUpdate_ValidInput_ReturnsUpdated() {
        // Arrange
        Long userId = 1L;
        
        UserEntity updatedUserEntity = UserEntity.builder()
                .email("test@example.com")
                .firstName("Jane")
                .lastName("Smith")
                .passwordHash("hashed_password")
                .Age(28)
                .Weight(65.0f)
                .Height(170.0f)
                .isActive(true)
                .build();
        updatedUserEntity.setId(userId);
        updatedUserEntity.setCreatedAt(testUserEntity.getCreatedAt());
        updatedUserEntity.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(userRepository.save(any(UserEntity.class))).thenReturn(updatedUserEntity);

        // Act
        UserResponse result = userService.update(userId, validUpdateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals(28, result.getAge());
        assertEquals(65.0f, result.getWeight());
        assertEquals(170.0f, result.getHeight());
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("update_NonExistentId_ThrowsException")
    void testUpdate_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.update(nonExistentId, validUpdateRequest);
        });
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("update_OnlyUpdatePartialFields_ReturnsUpdated")
    void testUpdate_OnlyUpdatePartialFields_ReturnsUpdated() {
        // Arrange
        Long userId = 1L;
        
        UserUpdateRequest partialUpdateRequest = UserUpdateRequest.builder()
                .firstName("Robert")
                .lastName("Johnson")
                .age(35)
                .weight(80.0f)
                .height(185.0f)
                .build();

        UserEntity updatedUserEntity = UserEntity.builder()
                .email("test@example.com")
                .firstName("Robert")
                .lastName("Johnson")
                .passwordHash("hashed_password")
                .Age(35)
                .Weight(80.0f)
                .Height(185.0f)
                .isActive(true)
                .build();
        updatedUserEntity.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(userRepository.save(any(UserEntity.class))).thenReturn(updatedUserEntity);

        // Act
        UserResponse result = userService.update(userId, partialUpdateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Robert", result.getFirstName());
        assertEquals("Johnson", result.getLastName());
        assertEquals(35, result.getAge());
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("delete_ValidId_DeletesSuccessfully")
    void testDelete_ValidId_DeletesSuccessfully() {
        // Arrange
        Long userId = 1L;
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // Act
        assertDoesNotThrow(() -> userService.delete(userId));

        // Assert
        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    @DisplayName("delete_NonExistentId_ThrowsException")
    void testDelete_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(userRepository.existsById(nonExistentId)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.delete(nonExistentId);
        });
        verify(userRepository, times(1)).existsById(nonExistentId);
        verify(userRepository, never()).deleteById(nonExistentId);
    }

    // ==================== DEACTIVATE TESTS ====================

    @Test
    @DisplayName("deactivate_ValidId_DeactivatesSuccessfully")
    void testDeactivate_ValidId_DeactivatesSuccessfully() {
        // Arrange
        Long userId = 1L;
        
        UserEntity activeUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(true)
                .build();
        activeUser.setId(userId);

        UserEntity inactiveUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(false)
                .build();
        inactiveUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser));
        when(userRepository.save(any(UserEntity.class))).thenReturn(inactiveUser);

        // Act
        assertDoesNotThrow(() -> userService.deactivate(userId));

        // Assert
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("deactivate_NonExistentId_ThrowsException")
    void testDeactivate_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.deactivate(nonExistentId);
        });
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    // ==================== ACTIVATE TESTS ====================

    @Test
    @DisplayName("activate_ValidId_ActivatesSuccessfully")
    void testActivate_ValidId_ActivatesSuccessfully() {
        // Arrange
        Long userId = 1L;
        
        UserEntity inactiveUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(false)
                .build();
        inactiveUser.setId(userId);

        UserEntity activeUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(true)
                .build();
        activeUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(inactiveUser));
        when(userRepository.save(any(UserEntity.class))).thenReturn(activeUser);

        // Act
        assertDoesNotThrow(() -> userService.activate(userId));

        // Assert
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("activate_NonExistentId_ThrowsException")
    void testActivate_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.activate(nonExistentId);
        });
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("activate_AlreadyActive_StillSucceeds")
    void testActivate_AlreadyActive_StillSucceeds() {
        // Arrange
        Long userId = 1L;
        
        UserEntity alreadyActiveUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .Age(30)
                .Weight(75.5f)
                .Height(180.0f)
                .isActive(true)
                .build();
        alreadyActiveUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(alreadyActiveUser));
        when(userRepository.save(any(UserEntity.class))).thenReturn(alreadyActiveUser);

        // Act
        assertDoesNotThrow(() -> userService.activate(userId));

        // Assert
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }
}
