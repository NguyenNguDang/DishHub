package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.exception.RecipeNotFoundException;
import com.nd.dishhub.model.IngredientEntity;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.RecipeIngredientEntity;
import com.nd.dishhub.model.RecipeIngredientId;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.IngredientRepository;
import com.nd.dishhub.repository.RecipeIngredientRepository;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.impl.RecipeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecipeService Custom Recipe Tests")
@Transactional
class RecipeServiceImplCustomRecipeTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private RecipeIngredientRepository recipeIngredientRepository;

    @InjectMocks
    private RecipeServiceImpl recipeService;

    private UserEntity testUser;
    private RecipeEntity originalRecipe;
    private IngredientEntity testIngredient1;
    private IngredientEntity testIngredient2;
    private RecipeIngredientEntity recipeIngredient1;
    private RecipeIngredientEntity recipeIngredient2;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = UserEntity.builder()
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .passwordHash("hashed_password")
                .isActive(true)
                .build();
        testUser.setId(1L);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Setup test ingredients
        testIngredient1 = IngredientEntity.builder()
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .build();
        testIngredient1.setId(1L);

        testIngredient2 = IngredientEntity.builder()
                .name("Onion")
                .caloriesPer100g(40.0)
                .carb(9.0)
                .fat(0.1)
                .build();
        testIngredient2.setId(2L);

        // Setup recipe ingredients
        recipeIngredient1 = RecipeIngredientEntity.builder()
                .id(new RecipeIngredientId(1L, 1L))
                .ingredient(testIngredient1)
                .quantity(200.0)
                .unit("gram")
                .build();

        recipeIngredient2 = RecipeIngredientEntity.builder()
                .id(new RecipeIngredientId(1L, 2L))
                .ingredient(testIngredient2)
                .quantity(150.0)
                .unit("gram")
                .build();

        // Setup original recipe
        originalRecipe = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUser)
                .parent(null)
                .build();
        originalRecipe.setId(1L);
        originalRecipe.setCreatedAt(LocalDateTime.now());
        originalRecipe.setUpdatedAt(LocalDateTime.now());
        originalRecipe.setRecipeIngredients(new HashSet<>(List.of(recipeIngredient1, recipeIngredient2)));
    }

    // ==================== FORK RECIPE TESTS ====================

    @Test
    @DisplayName("forkRecipe_ValidInput_ReturnsNewRecipeWithCopiedIngredients")
    void testForkRecipe_ValidInput_ReturnsNewRecipeWithCopiedIngredients() {
        // Arrange
        Long originalId = 1L;
        Long userId = 1L;

        RecipeEntity newRecipe = RecipeEntity.builder()
                .title(originalRecipe.getTitle())
                .instructions(originalRecipe.getInstructions())
                .isPublic(false)
                .user(testUser)
                .parent(originalRecipe)
                .build();
        newRecipe.setId(2L);
        newRecipe.setRecipeIngredients(new HashSet<>(List.of(recipeIngredient1, recipeIngredient2)));

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(recipeRepository.findByIdWithIngredients(originalId)).thenReturn(Optional.of(originalRecipe));
        when(recipeRepository.findByIdWithIngredients(newRecipe.getId())).thenReturn(Optional.of(newRecipe));
        when(recipeRepository.save(any(RecipeEntity.class))).thenAnswer(invocation -> {
            RecipeEntity saved = invocation.getArgument(0);
            if (saved.getId() == null) {
                saved.setId(newRecipe.getId());
            }
            return saved;
        });
        when(recipeIngredientRepository.save(any(RecipeIngredientEntity.class))).thenReturn(recipeIngredient1);
        when(recipeIngredientRepository.findByRecipeId(newRecipe.getId()))
                .thenReturn(List.of(recipeIngredient1, recipeIngredient2));

        // Act
        RecipeResponse result = recipeService.forkRecipe(originalId, userId);

        // Assert
        assertNotNull(result);
        assertEquals("Pasta Carbonara", result.getTitle());
        assertFalse(result.getIsPublic());
        assertEquals(userId, result.getUserId());
        assertEquals(originalId, result.getParentId());
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, times(1)).findByIdWithIngredients(originalId);
        verify(recipeRepository, times(2)).save(any(RecipeEntity.class));
        verify(recipeIngredientRepository, times(2)).save(any(RecipeIngredientEntity.class));
    }

    @Test
    @DisplayName("forkRecipe_UserNotFound_ThrowsException")
    void testForkRecipe_UserNotFound_ThrowsException() {
        // Arrange
        Long originalId = 1L;
        Long userId = 999L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> recipeService.forkRecipe(originalId, userId));
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, never()).findByIdWithIngredients(anyLong());
    }

    @Test
    @DisplayName("forkRecipe_OriginalRecipeNotFound_ThrowsRecipeNotFoundException")
    void testForkRecipe_OriginalRecipeNotFound_ThrowsRecipeNotFoundException() {
        // Arrange
        Long originalId = 999L;
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(recipeRepository.findByIdWithIngredients(originalId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RecipeNotFoundException.class, () -> recipeService.forkRecipe(originalId, userId));
        verify(userRepository, times(1)).findById(userId);
        verify(recipeRepository, times(1)).findByIdWithIngredients(originalId);
        verify(recipeRepository, never()).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("forkRecipe_WithEmptyIngredients_ReturnRecipeWithoutIngredients")
    void testForkRecipe_WithEmptyIngredients_ReturnRecipeWithoutIngredients() {
        // Arrange
        Long originalId = 1L;
        Long userId = 1L;

        RecipeEntity recipeWithoutIngredients = RecipeEntity.builder()
                .title("Empty Recipe")
                .instructions("No ingredients")
                .isPublic(true)
                .user(testUser)
                .parent(null)
                .build();
        recipeWithoutIngredients.setId(1L);
        recipeWithoutIngredients.setRecipeIngredients(new HashSet<>());

        RecipeEntity newRecipe = RecipeEntity.builder()
                .title("Empty Recipe")
                .instructions("No ingredients")
                .isPublic(false)
                .user(testUser)
                .parent(recipeWithoutIngredients)
                .build();
        newRecipe.setId(2L);
        newRecipe.setRecipeIngredients(new HashSet<>());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(recipeRepository.findByIdWithIngredients(originalId)).thenReturn(Optional.of(recipeWithoutIngredients));
        when(recipeRepository.findByIdWithIngredients(newRecipe.getId())).thenReturn(Optional.of(newRecipe));
        when(recipeRepository.save(any(RecipeEntity.class))).thenAnswer(invocation -> {
            RecipeEntity saved = invocation.getArgument(0);
            if (saved.getId() == null) {
                saved.setId(newRecipe.getId());
            }
            return saved;
        });
        when(recipeIngredientRepository.findByRecipeId(newRecipe.getId())).thenReturn(new ArrayList<>());

        // Act
        RecipeResponse result = recipeService.forkRecipe(originalId, userId);

        // Assert
        assertNotNull(result);
        assertFalse(result.getIsPublic());
        assertEquals(originalId, result.getParentId());
        verify(recipeIngredientRepository, never()).save(any(RecipeIngredientEntity.class));
    }

    // ==================== UPDATE RECIPE INGREDIENTS TESTS ====================

    @Test
    @DisplayName("updateRecipeIngredients_ValidInput_UpdatesIngredientsAndCalculatesNutrition")
    void testUpdateRecipeIngredients_ValidInput_UpdatesIngredientsAndCalculatesNutrition() {
        // Arrange
        Long recipeId = 1L;
        List<IngredientQuantityRequest> newIngredients = List.of(
                IngredientQuantityRequest.builder()
                        .ingredientId(1L)
                        .quantity(300.0)
                        .unit("gram")
                        .build(),
                IngredientQuantityRequest.builder()
                        .ingredientId(2L)
                        .quantity(200.0)
                        .unit("gram")
                        .build()
        );

        RecipeEntity updatedRecipe = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUser)
                .parent(null)
                .totalCalories(108.0)
                .totalCarbs(28.5)
                .totalFat(0.5)
                .build();
        updatedRecipe.setId(recipeId);

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.of(originalRecipe));
        when(ingredientRepository.findById(1L)).thenReturn(Optional.of(testIngredient1));
        when(ingredientRepository.findById(2L)).thenReturn(Optional.of(testIngredient2));
        when(recipeIngredientRepository.save(any(RecipeIngredientEntity.class))).thenReturn(recipeIngredient1);
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(updatedRecipe);

        // Act
        RecipeResponse result = recipeService.updateRecipeIngredients(recipeId, newIngredients);

        // Assert
        assertNotNull(result);
        assertEquals("Pasta Carbonara", result.getTitle());
        verify(recipeIngredientRepository, times(1)).deleteByRecipeId(recipeId);
        verify(ingredientRepository, times(2)).findById(anyLong());
        verify(recipeIngredientRepository, times(2)).save(any(RecipeIngredientEntity.class));
        verify(recipeRepository, times(2)).save(any(RecipeEntity.class));
    }

    @Test
    @DisplayName("updateRecipeIngredients_RecipeNotFound_ThrowsRecipeNotFoundException")
    void testUpdateRecipeIngredients_RecipeNotFound_ThrowsRecipeNotFoundException() {
        // Arrange
        Long recipeId = 999L;
        List<IngredientQuantityRequest> newIngredients = List.of();

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RecipeNotFoundException.class, () -> recipeService.updateRecipeIngredients(recipeId, newIngredients));
        verify(recipeIngredientRepository, never()).deleteByRecipeId(anyLong());
    }

    @Test
    @DisplayName("updateRecipeIngredients_IngredientNotFound_ThrowsException")
    void testUpdateRecipeIngredients_IngredientNotFound_ThrowsException() {
        // Arrange
        Long recipeId = 1L;
        List<IngredientQuantityRequest> newIngredients = List.of(
                IngredientQuantityRequest.builder()
                        .ingredientId(999L)
                        .quantity(100.0)
                        .unit("gram")
                        .build()
        );

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.of(originalRecipe));
        when(ingredientRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> recipeService.updateRecipeIngredients(recipeId, newIngredients));
        verify(recipeIngredientRepository, times(1)).deleteByRecipeId(recipeId);
    }

    @Test
    @DisplayName("updateRecipeIngredients_WithEmptyIngredients_ClearsAllIngredients")
    void testUpdateRecipeIngredients_WithEmptyIngredients_ClearsAllIngredients() {
        // Arrange
        Long recipeId = 1L;
        List<IngredientQuantityRequest> emptyIngredients = new ArrayList<>();

        RecipeEntity updatedRecipe = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUser)
                .parent(null)
                .totalCalories(0.0)
                .totalCarbs(0.0)
                .totalFat(0.0)
                .build();
        updatedRecipe.setId(recipeId);
        updatedRecipe.setRecipeIngredients(new HashSet<>());

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.of(originalRecipe));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(updatedRecipe);

        // Act
        RecipeResponse result = recipeService.updateRecipeIngredients(recipeId, emptyIngredients);

        // Assert
        assertNotNull(result);
        verify(recipeIngredientRepository, times(1)).deleteByRecipeId(recipeId);
        verify(recipeIngredientRepository, never()).save(any(RecipeIngredientEntity.class));
        verify(recipeRepository, times(2)).save(any(RecipeEntity.class));
    }

    // ==================== CALCULATE NUTRITION TESTS ====================

    @Test
    @DisplayName("calculateNutrition_ValidRecipe_CalculatesCorrectly")
    void testCalculateNutrition_ValidRecipe_CalculatesCorrectly() {
        // Arrange
        Long recipeId = 1L;

        // Tomato: 200g = 18 * 2 = 36 cal, 3.9 * 2 = 7.8 carb, 0.2 * 2 = 0.4 fat
        // Onion: 150g = 40 * 1.5 = 60 cal, 9 * 1.5 = 13.5 carb, 0.1 * 1.5 = 0.15 fat
        // Total: 96 cal, 21.3 carb, 0.55 fat

        RecipeEntity recipeWithIngredients = RecipeEntity.builder()
                .title("Pasta Carbonara")
                .instructions("Cook pasta, mix with sauce")
                .isPublic(true)
                .user(testUser)
                .build();
        recipeWithIngredients.setId(recipeId);
        recipeWithIngredients.setRecipeIngredients(new HashSet<>(List.of(recipeIngredient1, recipeIngredient2)));

        ArgumentCaptor<RecipeEntity> captor = ArgumentCaptor.forClass(RecipeEntity.class);

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.of(recipeWithIngredients));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(recipeWithIngredients);

        // Act
        recipeService.calculateNutrition(recipeId);

        // Assert
        verify(recipeRepository, times(1)).save(captor.capture());
        RecipeEntity savedRecipe = captor.getValue();
        
        assertNotNull(savedRecipe.getTotalCalories());
        assertNotNull(savedRecipe.getTotalCarbs());
        assertNotNull(savedRecipe.getTotalFat());
        assertNotNull(savedRecipe.getTotalProtein());
        assertTrue(savedRecipe.getTotalCalories() > 0);
    }

    @Test
    @DisplayName("calculateNutrition_RecipeWithoutIngredients_CalculatesToZero")
    void testCalculateNutrition_RecipeWithoutIngredients_CalculatesToZero() {
        // Arrange
        Long recipeId = 1L;

        RecipeEntity emptyRecipe = RecipeEntity.builder()
                .title("Empty Recipe")
                .instructions("No ingredients")
                .isPublic(true)
                .user(testUser)
                .build();
        emptyRecipe.setId(recipeId);
        emptyRecipe.setRecipeIngredients(new HashSet<>());

        ArgumentCaptor<RecipeEntity> captor = ArgumentCaptor.forClass(RecipeEntity.class);

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.of(emptyRecipe));
        when(recipeRepository.save(any(RecipeEntity.class))).thenReturn(emptyRecipe);

        // Act
        recipeService.calculateNutrition(recipeId);

        // Assert
        verify(recipeRepository, times(1)).save(captor.capture());
        RecipeEntity savedRecipe = captor.getValue();
        
        assertEquals(0.0, savedRecipe.getTotalCalories());
        assertEquals(0.0, savedRecipe.getTotalCarbs());
        assertEquals(0.0, savedRecipe.getTotalFat());
    }

    @Test
    @DisplayName("calculateNutrition_RecipeNotFound_ThrowsRecipeNotFoundException")
    void testCalculateNutrition_RecipeNotFound_ThrowsRecipeNotFoundException() {
        // Arrange
        Long recipeId = 999L;

        when(recipeRepository.findByIdWithIngredients(recipeId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RecipeNotFoundException.class, () -> recipeService.calculateNutrition(recipeId));
        verify(recipeRepository, never()).save(any(RecipeEntity.class));
    }

    // ==================== GET MY CUSTOM RECIPES TESTS ====================

    @Test
    @DisplayName("getMyCustomRecipes_ValidUser_ReturnsPrivateRecipes")
    void testGetMyCustomRecipes_ValidUser_ReturnsPrivateRecipes() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        RecipeEntity customRecipe = RecipeEntity.builder()
                .title("My Custom Pasta")
                .instructions("Custom instructions")
                .isPublic(false)
                .user(testUser)
                .parent(originalRecipe)
                .build();
        customRecipe.setId(2L);

        Page<RecipeEntity> pageResult = new PageImpl<>(List.of(customRecipe), pageable, 1);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findPrivateRecipesByUser(userId, pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getMyCustomRecipes(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertFalse(result.getContent().getFirst().getIsPublic());
        verify(userRepository, times(1)).existsById(userId);
        verify(recipeRepository, times(1)).findPrivateRecipesByUser(userId, pageable);
    }

    @Test
    @DisplayName("getMyCustomRecipes_UserNotFound_ThrowsException")
    void testGetMyCustomRecipes_UserNotFound_ThrowsException() {
        // Arrange
        Long userId = 999L;
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.existsById(userId)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> recipeService.getMyCustomRecipes(userId, pageable));
        verify(recipeRepository, never()).findPrivateRecipesByUser(anyLong(), any(Pageable.class));
    }

    @Test
    @DisplayName("getMyCustomRecipes_NoCustomRecipes_ReturnsEmptyPage")
    void testGetMyCustomRecipes_NoCustomRecipes_ReturnsEmptyPage() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        Page<RecipeEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findPrivateRecipesByUser(userId, pageable)).thenReturn(emptyPage);

        // Act
        Page<RecipeResponse> result = recipeService.getMyCustomRecipes(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getMyCustomRecipes_MultiplePages_ReturnsCorrectPage")
    void testGetMyCustomRecipes_MultiplePages_ReturnsCorrectPage() {
        // Arrange
        Long userId = 1L;
        Pageable pageable = PageRequest.of(1, 5);

        List<RecipeEntity> pageContent = new ArrayList<>();
        for (int i = 6; i <= 10; i++) {
            RecipeEntity recipe = RecipeEntity.builder()
                    .title("Recipe " + i)
                    .instructions("Instructions " + i)
                    .isPublic(false)
                    .user(testUser)
                    .build();
            recipe.setId((long) i);
            pageContent.add(recipe);
        }

        Page<RecipeEntity> pageResult = new PageImpl<>(pageContent, pageable, 20);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(recipeRepository.findPrivateRecipesByUser(userId, pageable)).thenReturn(pageResult);

        // Act
        Page<RecipeResponse> result = recipeService.getMyCustomRecipes(userId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(5, result.getContent().size());
        assertEquals(1, result.getNumber());
        assertEquals(20, result.getTotalElements());
        assertEquals(4, result.getTotalPages());
    }
}
