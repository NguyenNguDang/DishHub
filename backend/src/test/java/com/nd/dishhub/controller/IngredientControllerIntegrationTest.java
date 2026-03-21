package com.nd.dishhub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import com.nd.dishhub.service.IngredientService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Test for IngredientController
 * Sử dụng @SpringBootTest, MockMvc, và thực IngredientService (không mock)
 * Test xuyên suốt Controller -> Service -> Repository -> Database
 */
@SpringBootTest
@Transactional
@TestPropertySource(locations = "classpath:application-test.properties")
@DisplayName("IngredientController Integration Tests")
class IngredientControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private IngredientService ingredientService;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private IngredientRequest validIngredientRequest;

    private static final String API_ENDPOINT = "/api/v1/ingredients";

    @BeforeEach
    void setUp() {
        // Initialize ObjectMapper
        objectMapper = new ObjectMapper();
        
        // Initialize MockMvc with WebApplicationContext
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
        
        // Clear persistence context before each test
        entityManager.clear();
        
        // Create valid test data - use unique names to avoid conflicts
        validIngredientRequest = IngredientRequest.builder()
                .name("Broccoli_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(34.0)
                .carb(7.0)
                .fat(0.4)
                .build();
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("create_ValidInput_Returns201Created")
    void testCreate_ValidInput_Returns201Created() throws Exception {
        // Act & Assert
        ResultActions result = mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validIngredientRequest)));

        result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name", is(validIngredientRequest.getName())))
                .andExpect(jsonPath("$.caloriesPer100g", is(34.0)))
                .andExpect(jsonPath("$.carb", is(7.0)))
                .andExpect(jsonPath("$.fat", is(0.4)))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @Test
    @DisplayName("create_BlankName_Returns400BadRequest")
    void testCreate_BlankName_Returns400BadRequest() throws Exception {
        // Arrange
        IngredientRequest invalidRequest = IngredientRequest.builder()
                .name("") // Blank name
                .caloriesPer100g(34.0)
                .carb(7.0)
                .fat(0.4)
                .build();

        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }

    @Test
    @DisplayName("create_NullCalories_Returns400BadRequest")
    void testCreate_NullCalories_Returns400BadRequest() throws Exception {
        // Arrange
        IngredientRequest invalidRequest = IngredientRequest.builder()
                .name("Broccoli")
                .caloriesPer100g(null) // Null calories
                .carb(7.0)
                .fat(0.4)
                .build();

        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }

    @Test
    @DisplayName("create_NegativeCalories_Returns400BadRequest")
    void testCreate_NegativeCalories_Returns400BadRequest() throws Exception {
        // Arrange
        IngredientRequest invalidRequest = IngredientRequest.builder()
                .name("Broccoli")
                .caloriesPer100g(-10.0) // Negative calories
                .carb(7.0)
                .fat(0.4)
                .build();

        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }

    @Test
    @DisplayName("create_DuplicateName_Returns404NotFound")
    void testCreate_DuplicateName_Returns404NotFound() throws Exception {
        // Arrange - Create first ingredient
        ingredientService.create(validIngredientRequest);
        
        // Try to create duplicate
        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validIngredientRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("update_ValidInput_Returns200OK")
    void testUpdate_ValidInput_Returns200OK() throws Exception {
        // Arrange - Create ingredient first
        IngredientResponse created = ingredientService.create(validIngredientRequest);
        Long ingredientId = created.getId();
        
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Green Broccoli_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(35.0)
                .carb(7.2)
                .fat(0.5)
                .build();

        // Act & Assert
        mockMvc.perform(put(API_ENDPOINT + "/{id}", ingredientId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(ingredientId.intValue())))
                .andExpect(jsonPath("$.name", is(updateRequest.getName())))
                .andExpect(jsonPath("$.caloriesPer100g", is(35.0)))
                .andExpect(jsonPath("$.carb", is(7.2)))
                .andExpect(jsonPath("$.fat", is(0.5)));
    }

    @Test
    @DisplayName("update_NonExistentId_Returns404NotFound")
    void testUpdate_NonExistentId_Returns404NotFound() throws Exception {
        // Arrange
        Long nonExistentId = 9999L;
        IngredientRequest updateRequest = IngredientRequest.builder()
                .name("Test_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(35.0)
                .carb(7.2)
                .fat(0.5)
                .build();

        // Act & Assert
        mockMvc.perform(put(API_ENDPOINT + "/{id}", nonExistentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    @DisplayName("update_InvalidInput_Returns400BadRequest")
    void testUpdate_InvalidInput_Returns400BadRequest() throws Exception {
        // Arrange
        IngredientResponse created = ingredientService.create(validIngredientRequest);
        Long ingredientId = created.getId();
        
        IngredientRequest invalidRequest = IngredientRequest.builder()
                .name("Broccoli")
                .caloriesPer100g(null) // Invalid
                .carb(7.0)
                .fat(0.4)
                .build();

        // Act & Assert
        mockMvc.perform(put(API_ENDPOINT + "/{id}", ingredientId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("delete_ValidId_Returns204NoContent")
    void testDelete_ValidId_Returns204NoContent() throws Exception {
        // Arrange - Create ingredient first
        IngredientResponse created = ingredientService.create(validIngredientRequest);
        Long ingredientId = created.getId();

        // Act & Assert
        mockMvc.perform(delete(API_ENDPOINT + "/{id}", ingredientId))
                .andExpect(status().isNoContent());

        // Verify it was deleted
        try {
            ingredientService.getById(ingredientId);
            throw new AssertionError("Ingredient should have been deleted");
        } catch (RuntimeException e) {
            // Expected
        }
    }

    @Test
    @DisplayName("delete_NonExistentId_Returns404NotFound")
    void testDelete_NonExistentId_Returns404NotFound() throws Exception {
        // Arrange
        Long nonExistentId = 9999L;

        // Act & Assert
        mockMvc.perform(delete(API_ENDPOINT + "/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    @DisplayName("getById_ValidId_Returns200OK")
    void testGetById_ValidId_Returns200OK() throws Exception {
        // Arrange - Create ingredient first
        IngredientResponse created = ingredientService.create(validIngredientRequest);
        Long ingredientId = created.getId();

        // Act & Assert
        mockMvc.perform(get(API_ENDPOINT + "/{id}", ingredientId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(ingredientId.intValue())))
                .andExpect(jsonPath("$.name", is(validIngredientRequest.getName())))
                .andExpect(jsonPath("$.caloriesPer100g", is(34.0)))
                .andExpect(jsonPath("$.carb", is(7.0)))
                .andExpect(jsonPath("$.fat", is(0.4)));
    }

    @Test
    @DisplayName("getById_NonExistentId_Returns404NotFound")
    void testGetById_NonExistentId_Returns404NotFound() throws Exception {
        // Arrange
        Long nonExistentId = 9999L;

        // Act & Assert
        mockMvc.perform(get(API_ENDPOINT + "/{id}", nonExistentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    // ==================== GET ALL TESTS ====================

    @Test
    @DisplayName("getAll_ValidPageable_Returns200OK")
    void testGetAll_ValidPageable_Returns200OK() throws Exception {
        // Arrange - Create ingredient
        ingredientService.create(validIngredientRequest);

        // Act & Assert
        mockMvc.perform(get(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is(validIngredientRequest.getName())))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.totalPages", is(1)));
    }

    @Test
    @DisplayName("getAll_EmptyPage_Returns200OK")
    void testGetAll_EmptyPage_Returns200OK() throws Exception {
        // Act & Assert - No data in database
        mockMvc.perform(get(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements", is(0)));
    }

    @Test
    @DisplayName("getAll_WithPaginationParams_Returns200OK")
    void testGetAll_WithPaginationParams_Returns200OK() throws Exception {
        // Arrange - Create 5 ingredients
        for (int i = 1; i <= 5; i++) {
            ingredientService.create(IngredientRequest.builder()
                    .name("Ingredient_" + i + "_" + UUID.randomUUID().toString().substring(0, 8))
                    .caloriesPer100g(50.0 + i)
                    .carb(10.0 + i)
                    .fat(0.5 + i)
                    .build());
        }

        // Act & Assert
        mockMvc.perform(get(API_ENDPOINT)
                .param("page", "0")
                .param("size", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(5)))
                .andExpect(jsonPath("$.totalElements", is(5)))
                .andExpect(jsonPath("$.totalPages", is(1)))
                .andExpect(jsonPath("$.number", is(0)));
    }

    @Test
    @DisplayName("getAll_MultipleElements_ReturnsAllElements")
    void testGetAll_MultipleElements_ReturnsAllElements() throws Exception {
        // Arrange - Create 2 ingredients
        IngredientResponse response1 = ingredientService.create(IngredientRequest.builder()
                .name("Spinach_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(23.0)
                .carb(3.6)
                .fat(0.4)
                .build());

        IngredientResponse response2 = ingredientService.create(IngredientRequest.builder()
                .name("Kale_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(49.0)
                .carb(9.0)
                .fat(0.9)
                .build());

        // Act & Assert
        mockMvc.perform(get(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements", is(2)))
                .andExpect(jsonPath("$.content[*].id", hasSize(2)));
    }

    // ==================== EDGE CASES ====================

    @Test
    @DisplayName("create_WithMinValues_Returns201Created")
    void testCreate_WithMinValues_Returns201Created() throws Exception {
        // Arrange - Min values (0)
        IngredientRequest minValuesRequest = IngredientRequest.builder()
                .name("Zero Ingredient_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(0.0)
                .carb(0.0)
                .fat(0.0)
                .build();

        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(minValuesRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.caloriesPer100g", is(0.0)))
                .andExpect(jsonPath("$.carb", is(0.0)))
                .andExpect(jsonPath("$.fat", is(0.0)));
    }

    @Test
    @DisplayName("create_WithLargeValues_Returns201Created")
    void testCreate_WithLargeValues_Returns201Created() throws Exception {
        // Arrange - Large values
        IngredientRequest largeValuesRequest = IngredientRequest.builder()
                .name("High Calorie Food_" + UUID.randomUUID().toString().substring(0, 8))
                .caloriesPer100g(900.0)
                .carb(100.0)
                .fat(99.0)
                .build();


        // Act & Assert
        mockMvc.perform(post(API_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(largeValuesRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.caloriesPer100g", is(900.0)))
                .andExpect(jsonPath("$.carb", is(100.0)))
                .andExpect(jsonPath("$.fat", is(99.0)));
    }
}

