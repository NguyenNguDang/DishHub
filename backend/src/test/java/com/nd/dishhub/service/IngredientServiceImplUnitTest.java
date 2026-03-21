package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import com.nd.dishhub.model.IngredientEntity;
import com.nd.dishhub.repository.IngredientRepository;
import com.nd.dishhub.service.impl.IngredientServiceImpl;
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
@DisplayName("IngredientService Unit Tests")
@Transactional
class IngredientServiceImplUnitTest {

    @Mock
    private IngredientRepository ingredientRepository;

    @InjectMocks
    private IngredientServiceImpl ingredientService;

    private IngredientRequest validIngredientRequest;
    private IngredientEntity testIngredientEntity;
    private IngredientResponse expectedResponse;

    @BeforeEach
    void setUp() {
        validIngredientRequest = IngredientRequest.builder()
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .build();

        testIngredientEntity = IngredientEntity.builder()
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .build();
        // Manually set ID since it's from AbstractEntity
        testIngredientEntity.setId(1L);
        testIngredientEntity.setCreatedAt(LocalDateTime.now());
        testIngredientEntity.setUpdatedAt(LocalDateTime.now());

        expectedResponse = IngredientResponse.builder()
                .id(1L)
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .createdAt(testIngredientEntity.getCreatedAt())
                .updatedAt(testIngredientEntity.getUpdatedAt())
                .build();
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("create_ValidInput_ReturnsCreated")
    void testCreate_ValidInput_ReturnsCreated() {
        // Arrange
        when(ingredientRepository.existsByName(validIngredientRequest.getName()))
                .thenReturn(false);
        when(ingredientRepository.save(any(IngredientEntity.class)))
                .thenReturn(testIngredientEntity);

        // Act
        IngredientResponse result = ingredientService.create(validIngredientRequest);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getName(), result.getName());
        assertEquals(expectedResponse.getCaloriesPer100g(), result.getCaloriesPer100g());
        verify(ingredientRepository, times(1)).existsByName(validIngredientRequest.getName());
        verify(ingredientRepository, times(1)).save(any(IngredientEntity.class));
    }

    @Test
    @DisplayName("create_DuplicateName_ThrowsException")
    void testCreate_DuplicateName_ThrowsException() {
        // Arrange
        when(ingredientRepository.existsByName(validIngredientRequest.getName()))
                .thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.create(validIngredientRequest);
        });
        verify(ingredientRepository, times(1)).existsByName(validIngredientRequest.getName());
        verify(ingredientRepository, never()).save(any(IngredientEntity.class));
    }

    @Test
    @DisplayName("create_ZeroCalories_ReturnsCreated")
    void testCreate_ZeroCalories_ReturnsCreated() {
        // Arrange - Edge case: Zero calories (edge value but valid)
        IngredientRequest zeroCaloriesRequest = IngredientRequest.builder()
                .name("Water")
                .caloriesPer100g(0.0)
                .carb(0.0)
                .fat(0.0)
                .build();

        IngredientEntity zeroCaloriesEntity = IngredientEntity.builder()
                .name("Water")
                .caloriesPer100g(0.0)
                .carb(0.0)
                .fat(0.0)
                .build();
        zeroCaloriesEntity.setId(2L);
        zeroCaloriesEntity.setCreatedAt(LocalDateTime.now());
        zeroCaloriesEntity.setUpdatedAt(LocalDateTime.now());

        when(ingredientRepository.existsByName("Water")).thenReturn(false);
        when(ingredientRepository.save(any(IngredientEntity.class))).thenReturn(zeroCaloriesEntity);

        // Act
        IngredientResponse result = ingredientService.create(zeroCaloriesRequest);

        // Assert
        assertNotNull(result);
        assertEquals(0.0, result.getCaloriesPer100g());
        assertEquals(2L, result.getId());
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("update_ValidInput_ReturnsUpdated")
    void testUpdate_ValidInput_ReturnsUpdated() {
        // Arrange
        Long ingredientId = 1L;
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Cherry Tomato")
                .caloriesPer100g(20.0)
                .carb(4.0)
                .fat(0.3)
                .build();

        IngredientEntity existingEntity = IngredientEntity.builder()
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .build();
        existingEntity.setId(ingredientId);
        existingEntity.setCreatedAt(LocalDateTime.now());
        existingEntity.setUpdatedAt(LocalDateTime.now());

        IngredientEntity updatedEntity = IngredientEntity.builder()
                .name("Cherry Tomato")
                .caloriesPer100g(20.0)
                .carb(4.0)
                .fat(0.3)
                .build();
        updatedEntity.setId(ingredientId);
        updatedEntity.setCreatedAt(existingEntity.getCreatedAt());
        updatedEntity.setUpdatedAt(LocalDateTime.now());

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingEntity));
        when(ingredientRepository.existsByName("Cherry Tomato")).thenReturn(false);
        when(ingredientRepository.save(any(IngredientEntity.class))).thenReturn(updatedEntity);

        // Act
        IngredientResponse result = ingredientService.update(ingredientId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Cherry Tomato", result.getName());
        assertEquals(20.0, result.getCaloriesPer100g());
        verify(ingredientRepository, times(1)).findById(ingredientId);
        verify(ingredientRepository, times(1)).save(any(IngredientEntity.class));
    }

    @Test
    @DisplayName("update_NonExistentId_ThrowsException")
    void testUpdate_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(ingredientRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.update(nonExistentId, validIngredientRequest);
        });
        verify(ingredientRepository, times(1)).findById(nonExistentId);
        verify(ingredientRepository, never()).save(any(IngredientEntity.class));
    }

    @Test
    @DisplayName("update_DuplicateNameForDifferentIngredient_ThrowsException")
    void testUpdate_DuplicateNameForDifferentIngredient_ThrowsException() {
        // Arrange
        Long ingredientId = 1L;
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Existing Name")
                .caloriesPer100g(20.0)
                .carb(4.0)
                .fat(0.3)
                .build();

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(testIngredientEntity));
        when(ingredientRepository.existsByName("Existing Name")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.update(ingredientId, updateRequest);
        });
        verify(ingredientRepository, times(1)).findById(ingredientId);
        verify(ingredientRepository, never()).save(any(IngredientEntity.class));
    }

    @Test
    @DisplayName("update_SameNameAsExisting_ReturnsUpdated")
    void testUpdate_SameNameAsExisting_ReturnsUpdated() {
        // Arrange - Update with same name (should not throw exception)
        Long ingredientId = 1L;
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Tomato") // Same name
                .caloriesPer100g(20.0)
                .carb(4.0)
                .fat(0.3)
                .build();

        IngredientEntity existingEntity = IngredientEntity.builder()
                .name("Tomato")
                .caloriesPer100g(18.0)
                .carb(3.9)
                .fat(0.2)
                .build();
        existingEntity.setId(ingredientId);
        existingEntity.setCreatedAt(LocalDateTime.now());
        existingEntity.setUpdatedAt(LocalDateTime.now());

        IngredientEntity updatedEntity = IngredientEntity.builder()
                .name("Tomato")
                .caloriesPer100g(20.0)
                .carb(4.0)
                .fat(0.3)
                .build();
        updatedEntity.setId(ingredientId);
        updatedEntity.setCreatedAt(existingEntity.getCreatedAt());
        updatedEntity.setUpdatedAt(LocalDateTime.now());

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingEntity));
        when(ingredientRepository.save(any(IngredientEntity.class))).thenReturn(updatedEntity);

        // Act
        IngredientResponse result = ingredientService.update(ingredientId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Tomato", result.getName());
        verify(ingredientRepository, times(1)).findById(ingredientId);
        verify(ingredientRepository, times(1)).save(any(IngredientEntity.class));
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("delete_ValidId_DeletesSuccessfully")
    void testDelete_ValidId_DeletesSuccessfully() {
        // Arrange
        Long ingredientId = 1L;
        when(ingredientRepository.existsById(ingredientId)).thenReturn(true);
        doNothing().when(ingredientRepository).deleteById(ingredientId);

        // Act
        assertDoesNotThrow(() -> ingredientService.delete(ingredientId));

        // Assert
        verify(ingredientRepository, times(1)).existsById(ingredientId);
        verify(ingredientRepository, times(1)).deleteById(ingredientId);
    }

    @Test
    @DisplayName("delete_NonExistentId_ThrowsException")
    void testDelete_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(ingredientRepository.existsById(nonExistentId)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.delete(nonExistentId);
        });
        verify(ingredientRepository, times(1)).existsById(nonExistentId);
        verify(ingredientRepository, never()).deleteById(any());
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    @DisplayName("getById_ValidId_ReturnsIngredient")
    void testGetById_ValidId_ReturnsIngredient() {
        // Arrange
        Long ingredientId = 1L;
        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(testIngredientEntity));

        // Act
        IngredientResponse result = ingredientService.getById(ingredientId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getName(), result.getName());
        verify(ingredientRepository, times(1)).findById(ingredientId);
    }

    @Test
    @DisplayName("getById_NonExistentId_ThrowsException")
    void testGetById_NonExistentId_ThrowsException() {
        // Arrange
        Long nonExistentId = 999L;
        when(ingredientRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.getById(nonExistentId);
        });
        verify(ingredientRepository, times(1)).findById(nonExistentId);
    }

    // ==================== GET ALL TESTS ====================

    @Test
    @DisplayName("getAll_ValidPageable_ReturnsPaginatedResults")
    void testGetAll_ValidPageable_ReturnsPaginatedResults() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<IngredientEntity> ingredientList = new ArrayList<>();
        ingredientList.add(testIngredientEntity);

        Page<IngredientEntity> page = new PageImpl<>(ingredientList, pageable, 1);
        when(ingredientRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        assertEquals("Tomato", result.getContent().get(0).getName());
        verify(ingredientRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("getAll_EmptyPage_ReturnsEmptyPage")
    void testGetAll_EmptyPage_ReturnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<IngredientEntity> emptyPage = new PageImpl<>(new ArrayList<>(), pageable, 0);
        when(ingredientRepository.findAll(pageable)).thenReturn(emptyPage);

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertEquals(0, result.getContent().size());
        verify(ingredientRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("getAll_MultiplePages_ReturnsCorrectPage")
    void testGetAll_MultiplePages_ReturnsCorrectPage() {
        // Arrange
        Pageable pageable = PageRequest.of(1, 10); // Page 1 (second page)
        IngredientEntity ingredient2 = IngredientEntity.builder()
                .name("Lettuce")
                .caloriesPer100g(15.0)
                .carb(2.9)
                .fat(0.3)
                .build();
        ingredient2.setId(2L);
        ingredient2.setCreatedAt(LocalDateTime.now());
        ingredient2.setUpdatedAt(LocalDateTime.now());

        List<IngredientEntity> ingredientList = new ArrayList<>();
        ingredientList.add(ingredient2);

        Page<IngredientEntity> page = new PageImpl<>(ingredientList, pageable, 20); // Total 20 items
        when(ingredientRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(20, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        assertEquals(1, result.getPageable().getPageNumber()); // Page 1 (0-indexed)
        assertEquals("Lettuce", result.getContent().get(0).getName());
        verify(ingredientRepository, times(1)).findAll(pageable);
    }
}

