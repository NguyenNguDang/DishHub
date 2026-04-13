# 🌐 Meal Plan API - Quick Reference

## 📡 Base URL
```
http://localhost:8080/api/v1/meal-plans
```

## 🔐 Authentication
All endpoints require JWT Bearer token in header:
```
Authorization: Bearer {token}
```

---

## 📌 Endpoints

### ✨ CREATE - Add Recipe to Meal Plan

**POST** `/api/v1/meal-plans`

**Request Body:**
```json
{
  "recipeId": 1,
  "planDate": "2026-04-13",
  "mealType": "lunch"
}
```

**Response (201 Created):**
```json
{
  "id": 42,
  "userId": 5,
  "recipeId": 1,
  "recipeName": "Caesar Salad",
  "recipeImage": "https://example.com/salad.jpg",
  "planDate": "2026-04-13",
  "mealType": "lunch",
  "createdAt": "2026-04-13T10:30:00",
  "updatedAt": "2026-04-13T10:30:00"
}
```

**Error Cases:**
- `400 Bad Request` - Invalid meal type or missing fields
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Recipe doesn't exist
- `409 Conflict` - Meal plan already exists for this date/type

---

### 📖 READ

#### Get All Meal Plans
**GET** `/api/v1/meal-plans`

Response: `MealPlanResponse[]`

---

#### Get Weekly Meal Plans (Mon-Sun)
**GET** `/api/v1/meal-plans/weekly?date=2026-04-13`

- If `date` not provided: uses current date
- Returns all meals from Monday to Sunday of that week

Response: `MealPlanResponse[]` (max 28 meals for 7 days × 4 meal types)

---

#### Get Meal Plans by Date
**GET** `/api/v1/meal-plans/date/2026-04-13`

Response: `MealPlanResponse[]` (up to 4 meals: breakfast, lunch, dinner, snack)

---

#### Get Date Range
**GET** `/api/v1/meal-plans/range?startDate=2026-04-07&endDate=2026-04-13`

Response: `MealPlanResponse[]`

---

#### Get by Meal Type
**GET** `/api/v1/meal-plans/type/lunch`

Meal types: `breakfast`, `lunch`, `dinner`, `snack`

Response: `MealPlanResponse[]`

---

#### Get Specific Day & Meal Type
**GET** `/api/v1/meal-plans/day/2026-04-13/type/lunch`

Response: `MealPlanResponse` (single object)

---

#### Get Upcoming Meals
**GET** `/api/v1/meal-plans/upcoming`

Returns meals with `planDate >= TODAY`

Response: `MealPlanResponse[]`

---

#### Get Past Meals
**GET** `/api/v1/meal-plans/past`

Returns meals with `planDate < TODAY`

Response: `MealPlanResponse[]`

---

#### Get with Pagination
**GET** `/api/v1/meal-plans/paginated?page=0&size=10`

Response:
```json
{
  "content": [MealPlanResponse[], ...],
  "totalElements": 45,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 10
}
```

---

### 🗑️ DELETE

#### Delete by ID
**DELETE** `/api/v1/meal-plans/42`

Response:
```json
{
  "message": "Meal plan deleted successfully"
}
```

---

#### Delete by Date & Meal Type
**DELETE** `/api/v1/meal-plans/day/2026-04-13/type/lunch`

Response:
```json
{
  "message": "Meal plan deleted successfully"
}
```

---

## 🎯 Common Use Cases

### 1. Load Weekly Planner
```bash
GET /api/v1/meal-plans/weekly?date=2026-04-13
```

Gets all meals for the week of April 7-13, 2026

### 2. Add Recipe to Monday Lunch
```bash
POST /api/v1/meal-plans
{
  "recipeId": 5,
  "planDate": "2026-04-07",
  "mealType": "lunch"
}
```

### 3. Remove Tuesday Dinner
```bash
DELETE /api/v1/meal-plans/day/2026-04-08/type/dinner
```

### 4. Get All User's Recipes for Next Week
```bash
GET /api/v1/meal-plans/range?startDate=2026-04-14&endDate=2026-04-20
```

### 5. Check What's for Lunch Today
```bash
GET /api/v1/meal-plans/day/{TODAY}/type/lunch
```

---

## 🧠 Frontend Integration

### Example: Weekly Planner Hook
```typescript
import { useGetWeeklyMealPlans, useCreateMealPlan, useDeleteMealPlanByDateAndType } from '../hooks';

const { data: weeklyMeals, isLoading } = useGetWeeklyMealPlans('2026-04-13');

const createMutation = useCreateMealPlan({
  onSuccess: () => console.log('Saved!'),
  onError: (error) => console.error('Failed:', error),
});

const deleteMutation = useDeleteMealPlanByDateAndType({
  onSuccess: () => console.log('Deleted!'),
});

// Add recipe
createMutation.mutate({
  recipeId: 5,
  planDate: '2026-04-13',
  mealType: 'lunch',
});

// Remove recipe
deleteMutation.mutate({
  date: '2026-04-13',
  mealType: 'lunch',
});
```

---

## ⚠️ Validation Rules

| Field | Rules |
|-------|-------|
| `recipeId` | Required, must exist in database |
| `planDate` | Required, ISO format (YYYY-MM-DD) |
| `mealType` | Required, one of: breakfast, lunch, dinner, snack |
| Unique Key | (user_id, plan_date, meal_type) - cannot duplicate |

---

## 🔄 Cache Invalidation

After mutations, the following cache is invalidated:
- All meal plan queries
- Weekly queries
- Date range queries
- Meal type queries

Automatic refetch happens with 5-minute stale time.

---

## 📊 Response Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success (GET, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (no token or invalid) |
| 404 | Not Found (recipe/meal plan doesn't exist) |
| 409 | Conflict (meal plan already exists) |
| 500 | Server Error |

---

## 🐛 Common Issues

### Issue: "User not found"
**Solution:** Ensure you're logged in and token is valid

### Issue: "Recipe not found"
**Solution:** Use correct recipeId, verify recipe exists

### Issue: "Meal plan already exists"
**Solution:** Delete existing meal for that date/type first, or update it

### Issue: CORS Error
**Solution:** Ensure backend CORS is configured for frontend URL

---

## 📝 Database Schema

```sql
CREATE TABLE meal_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    plan_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_meal_plan (user_id, plan_date, meal_type),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);
```

---

## 🎓 Example Flow

```
1. User opens Weekly Meal Planner
   ↓
2. Frontend: GET /api/v1/meal-plans/weekly?date=2026-04-13
   ↓
3. Backend returns 7 days of meals
   ↓
4. UI displays meals in grid layout
   ↓
5. User clicks "Add Recipe" for Monday lunch
   ↓
6. Modal opens with recipe selection
   ↓
7. User selects "Caesar Salad" (recipeId: 5)
   ↓
8. Frontend: POST /api/v1/meal-plans
   {
     "recipeId": 5,
     "planDate": "2026-04-07",
     "mealType": "lunch"
   }
   ↓
9. Backend validates & saves to DB
   ↓
10. Frontend refetches weekly meals
    ↓
11. UI updates with new recipe
    ↓
12. User satisfaction! ✅
```

