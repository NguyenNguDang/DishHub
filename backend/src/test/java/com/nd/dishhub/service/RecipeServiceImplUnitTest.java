package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.impl.RecipeServiceImpl;
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
@DisplayName("RecipeService Unit Tests")
@Transactional
class RecipeServiceImplUnitTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RecipeServiceImpl recipeService;

    private RecipeRequest validRecipeRequest;
    private RecipeEntity testRecipeEntity;
    private RecipeResponse expectedResponse;
    private UserEntity testUserEntity;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUserEntity = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .isActive(true)
                .build();
        testUserEntity.setId(1L);
        testUserEntity.setCreatedAt(LocalDateTime.now());
        testUserEntity.setUpdatedAt(LocalDateTime.now());

        // Setup valid recipe request
        validRecipeRequest = RecipeRequest.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .parentId(null)
                .build();

        // Setup test recipe entity
        testRecipeEntity = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUserEntity)
                .parent(null)
                .build();
        testRecipeEntity.setId(1L);
        testRecipeEntity.setCreatedAt(LocalDateTime.now());
        testRecipeEntity.setUpdatedAt(LocalDateTime.now());

        // Setup expected response
        expectedResponse = RecipeResponse.builder()
                .id(1L)
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .userId(1L)
                .parentId(null)
                .createdAt(testRecipeEntity.getCreatedAt())
                .updatedAt(testRecipeEntity.getUpdatedAt())
                .build();
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("create_ValidInput_ReturnsCreated")
    void testCreate_ValidInput_ReturnsCreated() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(testRecipeEntity);

        // Act
        RecipeResponse result = recipeService.create(validRecipeRequest, userId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getTitle(), result.getTitle());
        assertEquals(expectedResponse.getInstructions(), result.getInstructions());
        assertEquals(expectedResponse.getIsPublic(), result.getIsPublic());
        assertEquals(userId, result.getUserId());
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, times(1)).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("create_UserNotFound_ThrowsException")
    void testCreate_UserNotFound_ThrowsException() {
        // Arrange
        Long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.create(validRecipeRequest, userId);
        });
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, never()).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("create_WithParentRecipe_ReturnsCreated")
    void testCreate_WithParentRecipe_ReturnsCreated() {
        // Arrange
        Long userId = 1L;
        Long parentId = 2L;

        RecipeRequest requestWithParent = RecipeRequest.builder()
                .title("Pasta Carbonara Variation")
                .instructions("Cook pasta, mix with different sauce")
                .isPublic(false)
                .parentId(parentId)
                .build();

        RecipeEntity parentRecipe = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Original recipe")
                .isPublic(true)
                .user(testUserEntity)
                .build();
        parentRecipe.setId(parentId);

        RecipeEntity recipeWithParent = RecipeEntity.builder()
                .title("Pasta Carbonara Variation")
                .instructions("Cook pasta, mix with different sauce")
                .isPublic(false)
                .user(testUserEntity)
                .parent(parentRecipe)
                .build();
        recipeWithParent.setId(1L);
        recipeWithParent.setCreatedAt(LocalDateTime.now());
        recipeWithParent.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(recipeRepository.findById(parentId)).thenReturn(Optional.of(parentRecipe));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(recipeWithParent);

        // Act
        RecipeResponse result = recipeService.create(requestWithParent, userId);

        // Assert
        assertNotNull(result);
        assertEquals("Pasta Carbonara Variation", result.getTitle());
        assertEquals(parentId, result.getParentId());
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, times(1)).findById(parentId);
        verify(recipeRepository, times(1)).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("create_ParentRecipeNotFound_ThrowsException")
    void testCreate_ParentRecipeNotFound_ThrowsException() {
        // Arrange
        Long userId = 1L;
        Long parentId = 999L;

        RecipeRequest requestWithParent = RecipeRequest.builder()
                .title("Pasta Carbonara Variation")
                .instructions("Cook pasta, mix with different sauce")
                .isPublic(false)
                .parentId(parentId)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(recipeRepository.findById(parentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.create(requestWithParent, userId);
        });
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, times(1)).findById(parentId);
        verify(recipeRepository, never()).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("create_PrivateRecipe_ReturnsCreated")
    void testCreate_PrivateRecipe_ReturnsCreated() {
        // Arrange
        Long userId = 1L;
        RecipeRequest privateRequest = RecipeRequest.builder()
                .title("Secret Recipe")
                .instructions("Top secret instructions")
                .isPublic(false)
                .parentId(null)
                .build();

        RecipeEntity privateRecipe = RecipeEntity.builder()
                .title("Secret Recipe")
                .instructions("Top secret instructions")
                .isPublic(false)
                .user(testUserEntity)
                .parent(null)
                .build();
        privateRecipe.setId(1L);
        privateRecipe.setCreatedAt(LocalDateTime.now());
        privateRecipe.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUserEntity));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(privateRecipe);

        // Act
        RecipeResponse result = recipeService.create(privateRequest, userId);

        // Assert
        assertNotNull(result);
        assertFalse(result.getIsPublic());
        assertEquals("Secret Recipe", result.getTitle());
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("update_ValidInput_ReturnsUpdated")
    void testUpdate_ValidInput_ReturnsUpdated() {
        // Arrange
        Long recipeId = 1L;
        RecipeRequest updateRequest = RecipeRequest.builder()
                .title("Updated Pasta Carbonara")
                .instructions("Updated instructions")
                .isPublic(false)
                .parentId(null)
                .build();

        RecipeEntity updatedRecipe = RecipeEntity.builder()
                .title("Updated Pasta Carbonara")
                .instructions("Updated instructions")
                .isPublic(false)
                .user(testUserEntity)
                .parent(null)
                .build();
        updatedRecipe.setId(recipeId);
        updatedRecipe.setCreatedAt(testRecipeEntity.getCreatedAt());
        updatedRecipe.setUpdatedAt(LocalDateTime.now());

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(testRecipeEntity));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(updatedRecipe);

        // Act
        RecipeResponse result = recipeService.update(recipeId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Pasta Carbonara", result.getTitle());
        assertEquals("Updated instructions", result.getInstructions());
        assertFalse(result.getIsPublic());
        verify(recipeRepository, times(1)).findById(recipeId);
        verify(recipeRepository, times(1)).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("update_NonExistentId_ThrowsException")
    void testUpdate_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(recipeRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.update(nonExistentId, validRecipeRequest);
        });
        verify(recipeRepository, times(1)).findById(nonExistentId);
        verify(recipeRepository, never()).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("update_ChangeParentRecipe_ReturnsUpdated")
    void testUpdate_ChangeParentRecipe_ReturnsUpdated() {
        // Arrange
        Long recipeId = 1L;
        Long newParentId = 3L;

        RecipeEntity newParent = RecipeEntity.builder()
                .title("New Parent Recipe")
                .instructions("New parent instructions")
                .isPublic(true)
                .user(testUserEntity)
                .build();
        newParent.setId(newParentId);

        RecipeRequest updateRequest = RecipeRequest.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .parentId(newParentId)
                .build();

        RecipeEntity updatedRecipe = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUserEntity)
                .parent(newParent)
                .build();
        updatedRecipe.setId(recipeId);

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(testRecipeEntity));
        when(recipeRepository.findById(newParentId)).thenReturn(Optional.of(newParent));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(updatedRecipe);

        // Act
        RecipeResponse result = recipeService.update(recipeId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(newParentId, result.getParentId());
        verify(recipeRepository, times(1)).findById(recipeId);
        verify(recipeRepository, times(1)).findById(newParentId);
        verify(recipeRepository, times(1)).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("update_NewParentNotFound_ThrowsException")
    void testUpdate_NewParentNotFound_ThrowsException() {
        // Arrange
        Long recipeId = 1L;
        Long nonExistentParentId = 999L;

        RecipeRequest updateRequest = RecipeRequest.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .parentId(nonExistentParentId)
                .build();

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(testRecipeEntity));
        when(recipeRepository.findById(nonExistentParentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.update(recipeId, updateRequest);
        });
        verify(recipeRepository, times(1)).findById(recipeId);
        verify(recipeRepository, times(1)).findById(nonExistentParentId);
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("delete_ValidId_DeletesSuccessfully")
    void testDelete_ValidId_DeletesSuccessfully() {
        // Arrange
        Long recipeId = 1L;
        when(recipeRepository.existsById(recipeId)).thenReturn(true);
        doNothing().when(recipeRepository).deleteById(recipeId);

        // Act
        assertDoesNotThrow(() -> recipeService.delete(recipeId));

        // Assert
        verify(recipeRepository, times(1)).existsById(recipeId);
        verify(recipeRepository, times(1)).deleteById(recipeId);
    }

    @Test
    @DisplayName("delete_NonExistentId_ThrowsException")
    void testDelete_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(recipeRepository.existsById(nonExistentId)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.delete(nonExistentId);
        });
        verify(recipeRepository, times(1)).existsById(nonExistentId);
        verify(recipeRepository, never()).deleteById(nonExistentId);
    }

    // ==================== GETBYID TESTS ====================

    @Test
    @DisplayName("getById_ValidId_ReturnsRecipe")
    void testGetById_ValidId_ReturnsRecipe() {
        // Arrange
        Long recipeId = 1L;
        when(recipeRepository.findByIdWithAllRelationships(recipeId)).thenReturn(Optional.of(testRecipeEntity));

        // Act
        RecipeResponse result = recipeService.getById(recipeId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getTitle(), result.getTitle());
        assertEquals(expectedResponse.getInstructions(), result.getInstructions());
        verify(recipeRepository, times(1)).findByIdWithAllRelationships(recipeId);
    }

    @Test
    @DisplayName("getById_NonExistentId_ThrowsException")
    void testGetById_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(recipeRepository.findByIdWithAllRelationships(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.getById(nonExistentId);
        });
        verify(recipeRepository, times(1)).findByIdWithAllRelationships(nonExistentId);
    }

    @Test
    @DisplayName("getById_RecipeWithParent_ReturnsRecipeWithParentId")
    void testGetById_RecipeWithParent_ReturnsRecipeWithParentId() {
        // Arrange
        Long recipeId = 1L;
        Long parentId = 2L;

        RecipeEntity parentRecipe = RecipeEntity.builder()
                .title("Parent Recipe")
                .instructions("Parent instructions")
                .isPublic(true)
                .user(testUserEntity)
                .build();
        parentRecipe.setId(parentId);

        RecipeEntity recipeWithParent = RecipeEntity.builder()
                .title("Child Recipe")
                .instructions("Child instructions")
                .isPublic(false)
                .user(testUserEntity)
                .parent(parentRecipe)
                .build();
        recipeWithParent.setId(recipeId);

        when(recipeRepository.findByIdWithAllRelationships(recipeId)).thenReturn(Optional.of(recipeWithParent));

        // Act
        RecipeResponse result = recipeService.getById(recipeId);

        // Assert
        assertNotNull(result);
        assertEquals(parentId, result.getParentId());
        assertEquals("Child Recipe", result.getTitle());
    }

    // ==================== GETALL TESTS ====================

    @Test
    @DisplayName("getAll_ValidPagination_ReturnsPageOfRecipes")
    void testGetAll_ValidPagination_ReturnsPageOfRecipes() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<RecipeEntity> recipes = new ArrayList<>();
        recipes.add(testRecipeEntity);

        RecipeEntity recipe2 = RecipeEntity.builder()
                .title("Pasta Aglio e Olio")
                .instructions("Simple pasta")
                .isPublic(true)
                .user(testUserEntity)
                .build();
        recipe2.setId(2L);
        recipes.add(recipe2);

        Page<RecipeEntity> pageResult = new PageImpl<>(recipes, pageable, 2);
        when(recipeRepository.findAll(pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        verify(recipeRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("getAll_EmptyResult_ReturnsEmptyPage")
    void testGetAll_EmptyResult_ReturnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<RecipeEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);
        when(recipeRepository.findAll(pageable)).thenReturn(emptyPage);

        // Act
        Page<RecipeResponse> result = recipeService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
        assertTrue(result.isEmpty());
    }

    // ==================== GETPUBLICRECIPES TESTS ====================

    @Test
    @DisplayName("getPublicRecipes_ValidPagination_ReturnsPublicRecipes")
    void testGetPublicRecipes_ValidPagination_ReturnsPublicRecipes() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<RecipeEntity> publicRecipes = new ArrayList<>();
        publicRecipes.add(testRecipeEntity); // testRecipeEntity has isPublic=true

        Page<RecipeEntity> pageResult = new PageImpl<>(publicRecipes, pageable, 1);
        when(recipeRepository.findByIsPublicTrue(pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getPublicRecipes(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getIsPublic());
        verify(recipeRepository, times(1)).findByIsPublicTrue(pageable);
    }

    @Test
    @DisplayName("getPublicRecipes_NoPublicRecipes_ReturnsEmptyPage")
    void testGetPublicRecipes_NoPublicRecipes_ReturnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<RecipeEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);
        when(recipeRepository.findByIsPublicTrue(pageable)).thenReturn(emptyPage);

        // Act
        Page<RecipeResponse> result = recipeService.getPublicRecipes(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }

    // ==================== GETRECIPESBYUSER TESTS ====================

    @Test
    @DisplayName("getRecipesByUser_ValidUser_ReturnsUserRecipes")
    void testGetRecipesByUser_ValidUser_ReturnsUserRecipes() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        List<RecipeEntity> userRecipes = new ArrayList<>();
        userRecipes.add(testRecipeEntity);

        Page<RecipeEntity> pageResult = new PageImpl<>(userRecipes, pageable, 1);
        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findByUserId(userId, pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getRecipesByUser(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(userId, result.getContent().get(0).getUserId());
        verify(userRepository, times(1)).existsById(userId);
        verify(recipeRepository, times(1)).findByUserId(userId, pageable);
    }

    @Test
    @DisplayName("getRecipesByUser_UserNotFound_ThrowsException")
    void testGetRecipesByUser_UserNotFound_ThrowsException() {
        // Arrange
        Long nonExistentUserId = 999L;
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.existsById(nonExistentUserId)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            recipeService.getRecipesByUser(nonExistentUserId, pageable);
        });
        verify(userRepository, times(1)).existsById(nonExistentUserId);
        verify(recipeRepository, never()).findByUserId(anyLong(), any(Pageable.class));
    }

    @Test
    @DisplayName("getRecipesByUser_UserHasNoRecipes_ReturnsEmptyPage")
    void testGetRecipesByUser_UserHasNoRecipes_ReturnsEmptyPage() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        Page<RecipeEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);
        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findByUserId(userId, pageable)).thenReturn(emptyPage);

        // Act
        Page<RecipeResponse> result = recipeService.getRecipesByUser(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }

    @Test
    @DisplayName("getRecipesByUser_MultiplePages_ReturnsCorrectPage")
    void testGetRecipesByUser_MultiplePages_ReturnsCorrectPage() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(1, 5); // Page 1 (second page), size 5
        List<RecipeEntity> pageContent = new ArrayList<>();
        for (int i = 6; i <= 10; i++) {
            RecipeEntity recipe = RecipeEntity.builder()
                    .title("Recipe " + i)
                    .instructions("Instructions " + i)
                    .isPublic(true)
                    .user(testUserEntity)
                    .build();
            recipe.setId((long) i);
            pageContent.add(recipe);
        }

        Page<RecipeEntity> pageResult = new PageImpl<>(pageContent, pageable, 20); // Total 20 recipes
        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findByUserId(userId, pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getRecipesByUser(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(5, result.getContent().size());
        assertEquals(1, result.getNumber()); // Page 1
        assertEquals(20, result.getTotalElements());
        assertEquals(4, result.getTotalPages());
    }
}

