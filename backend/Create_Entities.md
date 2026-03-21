### Role:
Act as a Senior Java Developer.

### Task:
Create JPA Entities for a Spring Boot project based on the provided ER diagram.

### Context & Guidelines:
- All entities must have the same base structure as the existing `UserEntity` (e.g., extending a `BaseEntity` for common fields).
- Strictly apply OOP, Clean Code, and SOLID principles.
- Use Lombok (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`).
- Map column names explicitly using `@Column(name="...")` to map Java `camelCase` to DB `snake_case`.
- Use `Double` or `BigDecimal` for precise numeric fields (calories, carb, fat, weight).
- Establish correct JPA relationships (`@OneToMany`, `@ManyToOne`, `@ManyToMany`) with `FetchType.LAZY`.
- Note: Junction tables without extra columns (`UserHasRole`, `Recipe_Tag`) should be mapped via `@JoinTable` inside the main entities, not as separate Entity classes.
- Output ONLY the Entity classes for now.

### Entities & Fields Structure:

2. **IngredientEntity**
    - `name` (String)
    - `calories_per_100g` (Double)
    - `carb` (Double)
    - `fat` (Double)

3. **RoleEntity**
    - `name`, `description` (String)

4. **RecipeEntity**
    - `user_id`, `parent_id` (Relationship/FK)
    - `title`, `instructions` (String)
    - `is_public` (Boolean)

5. **RecipeIngredientEntity** (Junction with extra columns)
    - `recipe_id`, `ingredient_id` (Relationship/FK)
    - `quantity` (Double)
    - `unit` (String)

6. **TagEntity**
    - `name` (String)

7. **MealPlanEntity**
    - `user_id`, `recipe_id` (Relationship/FK)
    - `plan_date` (LocalDate/LocalDateTime)
    - `meal_type` (String/Enum)

8. **ReviewEntity**
    - `user_id`, `recipe_id` (Relationship/FK)
    - `rating` (Integer/Double)
    - `comment` (String)
    - `created_at` (LocalDateTime)