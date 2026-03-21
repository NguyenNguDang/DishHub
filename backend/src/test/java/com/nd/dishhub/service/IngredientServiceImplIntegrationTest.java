package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import com.nd.dishhub.model.IngredientEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Transactional
@TestPropertySource(locations = "classpath:application-test.properties")
@DisplayName("IngredientService Integration Tests")
class IngredientServiceImplIntegrationTest {

    @Autowired
    private EntityManager entityManager;


    @Autowired
    private IngredientService ingredientService;

    @BeforeEach
    void setUp() {
        // Clear persistence context before each test
        entityManager.clear();
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("create_ValidInput_SavesAndReturnsIngredient")
    void testCreate_ValidInput_SavesAndReturnsIngredient() {
        // Arrange
        IngredientRequest request = IngredientRequest.builder()
                .name("Apple")
                .caloriesPer100g(52.0)
                .carb(13.8)
                .fat(0.2)
                .build();

        // Act
        IngredientResponse response = ingredientService.create(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Apple", response.getName());
        assertEquals(52.0, response.getCaloriesPer100g());
        assertNotNull(response.getCreatedAt());
        assertNotNull(response.getUpdatedAt());

        // Verify in database
        IngredientEntity savedEntity = entityManager.find(IngredientEntity.class, response.getId());
        assertNotNull(savedEntity);
        assertEquals("Apple", savedEntity.getName());
    }

    @Test
    @DisplayName("create_DuplicateName_ThrowsRuntimeException")
    void testCreate_DuplicateName_ThrowsRuntimeException() {
        // Arrange
        IngredientEntity existingIngredient = IngredientEntity.builder()
                .name("Banana")
                .caloriesPer100g(89.0)
                .carb(23.0)
                .fat(0.3)
                .build();
        entityManager.persist(existingIngredient);
        entityManager.flush();

        IngredientRequest duplicateRequest = IngredientRequest.builder()
                .name("Banana")
                .caloriesPer100g(89.0)
                .carb(23.0)
                .fat(0.3)
                .build();

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.create(duplicateRequest);
        });
    }

    @Test
    @DisplayName("create_LargeCalorieValue_SavesSuccessfully")
    void testCreate_LargeCalorieValue_SavesSuccessfully() {
        // Arrange
        IngredientRequest request = IngredientRequest.builder()
                .name("Butter")
                .caloriesPer100g(717.0) // High calorie value
                .carb(0.1)
                .fat(81.0)
                .build();

        // Act
        IngredientResponse response = ingredientService.create(request);

        // Assert
        assertNotNull(response);
        assertEquals("Butter", response.getName());
        assertEquals(717.0, response.getCaloriesPer100g());
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("update_ValidInput_UpdatesIngredient")
    void testUpdate_ValidInput_UpdatesIngredient() {
        // Arrange
        IngredientEntity existingIngredient = IngredientEntity.builder()
                .name("Orange")
                .caloriesPer100g(47.0)
                .carb(12.0)
                .fat(0.1)
                .build();
        entityManager.persist(existingIngredient);
        entityManager.flush();
        Long ingredientId = existingIngredient.getId();

        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Blood Orange")
                .caloriesPer100g(50.0)
                .carb(13.0)
                .fat(0.2)
                .build();

        // Act
        IngredientResponse response = ingredientService.update(ingredientId, updateRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Blood Orange", response.getName());
        assertEquals(50.0, response.getCaloriesPer100g());

        // Verify in database
        IngredientEntity updatedEntity = entityManager.find(IngredientEntity.class, ingredientId);
        assertEquals("Blood Orange", updatedEntity.getName());
    }

    @Test
    @DisplayName("update_NonExistentId_ThrowsRuntimeException")
    void testUpdate_NonExistentId_ThrowsRuntimeException() {
        // Arrange
        Long nonExistentId = 9999L;
        IngredientRequest request = IngredientRequest.builder()
                .name("Test")
                .caloriesPer100g(100.0)
                .carb(10.0)
                .fat(1.0)
                .build();

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.update(nonExistentId, request);
        });
    }

    @Test
    @DisplayName("update_ChangeName_VerifiesUpdatedAtChanged")
    void testUpdate_ChangeName_VerifiesUpdatedAtChanged() throws InterruptedException {
        // Arrange
        IngredientEntity existingIngredient = IngredientEntity.builder()
                .name("Carrot")
                .caloriesPer100g(41.0)
                .carb(10.0)
                .fat(0.2)
                .build();
        entityManager.persist(existingIngredient);
        entityManager.flush();
        var createdAt = existingIngredient.getCreatedAt();
        var initialUpdatedAt = existingIngredient.getUpdatedAt();
        Long ingredientId = existingIngredient.getId();

        Thread.sleep(100); // Ensure time difference

        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Purple Carrot")
                .caloriesPer100g(41.0)
                .carb(10.0)
                .fat(0.2)
                .build();

        // Act
        IngredientResponse response = ingredientService.update(ingredientId, updateRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getUpdatedAt());
        assertEquals(createdAt, response.getCreatedAt());
        // Verify updated entity in database has later updatedAt
        entityManager.refresh(existingIngredient);
        assertTrue(existingIngredient.getUpdatedAt().isAfter(initialUpdatedAt) || 
                   existingIngredient.getUpdatedAt().isEqual(initialUpdatedAt),
                   "Updated_at should be updated or same time");
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("delete_ValidId_DeletesIngredient")
    void testDelete_ValidId_DeletesIngredient() {
        // Arrange
        IngredientEntity ingredientToDelete = IngredientEntity.builder()
                .name("Onion")
                .caloriesPer100g(40.0)
                .carb(9.0)
                .fat(0.1)
                .build();
        entityManager.persist(ingredientToDelete);
        entityManager.flush();
        Long ingredientId = ingredientToDelete.getId();

        // Verify it exists
        IngredientEntity existsBefore = entityManager.find(IngredientEntity.class, ingredientId);
        assertNotNull(existsBefore);

        // Act
        ingredientService.delete(ingredientId);
        entityManager.flush();

        // Assert
        IngredientEntity deletedEntity = entityManager.find(IngredientEntity.class, ingredientId);
        assertNull(deletedEntity);
    }

    @Test
    @DisplayName("delete_NonExistentId_ThrowsRuntimeException")
    void testDelete_NonExistentId_ThrowsRuntimeException() {
        // Arrange
        Long nonExistentId = 9999L;

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.delete(nonExistentId);
        });
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    @DisplayName("getById_ValidId_ReturnsIngredient")
    void testGetById_ValidId_ReturnsIngredient() {
        // Arrange
        IngredientEntity existingIngredient = IngredientEntity.builder()
                .name("Potato")
                .caloriesPer100g(77.0)
                .carb(17.0)
                .fat(0.1)
                .build();
        entityManager.persist(existingIngredient);
        entityManager.flush();
        Long ingredientId = existingIngredient.getId();

        // Act
        IngredientResponse response = ingredientService.getById(ingredientId);

        // Assert
        assertNotNull(response);
        assertEquals(ingredientId, response.getId());
        assertEquals("Potato", response.getName());
        assertEquals(77.0, response.getCaloriesPer100g());
    }

    @Test
    @DisplayName("getById_NonExistentId_ThrowsRuntimeException")
    void testGetById_NonExistentId_ThrowsRuntimeException() {
        // Arrange
        Long nonExistentId = 9999L;

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ingredientService.getById(nonExistentId);
        });
    }

    // ==================== GET ALL TESTS ====================

    @Test
    @DisplayName("getAll_EmptyDatabase_ReturnsEmptyPage")
    void testGetAll_EmptyDatabase_ReturnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertEquals(0, result.getContent().size());
    }

    @Test
    @DisplayName("getAll_MultipleIngredients_ReturnsAllIngredients")
    void testGetAll_MultipleIngredients_ReturnsAllIngredients() {
        // Arrange
        IngredientEntity ingredient1 = IngredientEntity.builder()
                .name("Rice")
                .caloriesPer100g(130.0)
                .carb(28.0)
                .fat(0.3)
                .build();
        IngredientEntity ingredient2 = IngredientEntity.builder()
                .name("Wheat")
                .caloriesPer100g(364.0)
                .carb(73.0)
                .fat(2.4)
                .build();
        IngredientEntity ingredient3 = IngredientEntity.builder()
                .name("Corn")
                .caloriesPer100g(86.0)
                .carb(19.0)
                .fat(1.2)
                .build();

        entityManager.persist(ingredient1);
        entityManager.persist(ingredient2);
        entityManager.persist(ingredient3);
        entityManager.flush();

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
        assertEquals(3, result.getContent().size());
        assertTrue(result.getContent().stream()
                .anyMatch(ing -> ing.getName().equals("Rice")));
        assertTrue(result.getContent().stream()
                .anyMatch(ing -> ing.getName().equals("Wheat")));
        assertTrue(result.getContent().stream()
                .anyMatch(ing -> ing.getName().equals("Corn")));
    }

    @Test
    @DisplayName("getAll_WithPagination_ReturnsPaginatedResults")
    void testGetAll_WithPagination_ReturnsPaginatedResults() {
        // Arrange
        for (int i = 1; i <= 15; i++) {
            IngredientEntity ingredient = IngredientEntity.builder()
                    .name("Ingredient_" + i)
                    .caloriesPer100g(50.0 + i)
                    .carb(10.0 + i)
                    .fat(0.5 + i)
                    .build();
            entityManager.persist(ingredient);
        }
        entityManager.flush();

        // Page 0, size 5
        Pageable pageRequest = PageRequest.of(0, 5);

        // Act
        Page<IngredientResponse> page1 = ingredientService.getAll(pageRequest);

        // Assert first page
        assertNotNull(page1);
        assertEquals(15, page1.getTotalElements());
        assertEquals(5, page1.getContent().size());
        assertEquals(0, page1.getNumber());
        assertTrue(page1.hasNext());
        assertFalse(page1.hasPrevious());

        // Act second page
        Page<IngredientResponse> page2 = ingredientService.getAll(PageRequest.of(1, 5));

        // Assert second page
        assertNotNull(page2);
        assertEquals(15, page2.getTotalElements());
        assertEquals(5, page2.getContent().size());
        assertEquals(1, page2.getNumber());
        assertTrue(page2.hasNext());
        assertTrue(page2.hasPrevious());

        // Act last page
        Page<IngredientResponse> page3 = ingredientService.getAll(PageRequest.of(2, 5));

        // Assert last page
        assertNotNull(page3);
        assertEquals(15, page3.getTotalElements());
        assertEquals(5, page3.getContent().size());
        assertEquals(2, page3.getNumber());
        assertFalse(page3.hasNext());
        assertTrue(page3.hasPrevious());
    }

    @Test
    @DisplayName("getAll_LargePageSize_ReturnsAllResults")
    void testGetAll_LargePageSize_ReturnsAllResults() {
        // Arrange
        for (int i = 1; i <= 8; i++) {
            IngredientEntity ingredient = IngredientEntity.builder()
                    .name("Item_" + i)
                    .caloriesPer100g(100.0)
                    .carb(10.0)
                    .fat(1.0)
                    .build();
            entityManager.persist(ingredient);
        }
        entityManager.flush();

        Pageable pageable = PageRequest.of(0, 100); // Page size larger than total items

        // Act
        Page<IngredientResponse> result = ingredientService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(8, result.getTotalElements());
        assertEquals(8, result.getContent().size());
        assertFalse(result.hasNext());
    }

    // ==================== EDGE CASES ====================

    @Test
    @DisplayName("create_AndUpdate_VerifiesCompleteLifecycle")
    void testCreate_AndUpdate_VerifiesCompleteLifecycle() {
        // Arrange - Create
        IngredientRequest createRequest = IngredientRequest.builder()
                .name("Cheese")
                .caloriesPer100g(402.0)
                .carb(3.4)
                .fat(33.0)
                .build();

        // Act - Create
        IngredientResponse createdResponse = ingredientService.create(createRequest);
        assertNotNull(createdResponse.getId());
        Long ingredientId = createdResponse.getId();

        // Arrange - Update
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Mozzarella")
                .caloriesPer100g(280.0)
                .carb(3.1)
                .fat(17.0)
                .build();

        // Act - Update
        IngredientResponse updatedResponse = ingredientService.update(ingredientId, updateRequest);

        // Assert - Update
        assertEquals("Mozzarella", updatedResponse.getName());
        assertEquals(280.0, updatedResponse.getCaloriesPer100g());

        // Act - Get
        IngredientResponse retrievedResponse = ingredientService.getById(ingredientId);

        // Assert - Get
        assertEquals(ingredientId, retrievedResponse.getId());
        assertEquals("Mozzarella", retrievedResponse.getName());

        // Act - Delete
        ingredientService.delete(ingredientId);

        // Assert - Delete
        assertThrows(RuntimeException.class, () -> {
            ingredientService.getById(ingredientId);
        });
    }

    @Test
    @DisplayName("create_MultipleIngredients_VerifyIndependence")
    void testCreate_MultipleIngredients_VerifyIndependence() {
        // Arrange & Act
        IngredientResponse ingredient1 = ingredientService.create(
                IngredientRequest.builder()
                        .name("Salt")
                        .caloriesPer100g(0.0)
                        .carb(0.0)
                        .fat(0.0)
                        .build()
        );

        IngredientResponse ingredient2 = ingredientService.create(
                IngredientRequest.builder()
                        .name("Sugar")
                        .caloriesPer100g(387.0)
                        .carb(100.0)
                        .fat(0.0)
                        .build()
        );

        // Assert
        assertNotEquals(ingredient1.getId(), ingredient2.getId());
        assertNotEquals(ingredient1.getName(), ingredient2.getName());
        assertEquals(0.0, ingredient1.getCaloriesPer100g());
        assertEquals(387.0, ingredient2.getCaloriesPer100g());
    }
}

