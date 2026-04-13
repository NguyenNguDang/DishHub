# 📅 Weekly Meal Planner - API Integration Guide

## Trang đã tích hợp những API nào?

### 1. **GET /api/v1/recipes/public**
Lấy danh sách tất cả công thức công khai từ backend

**Endpoint:**
```
GET http://localhost:8080/api/v1/recipes/public?page=0&size=50
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Quinoa Buddha Bowl",
      "description": "Healthy vegetarian bowl",
      "image": "https://example.com/image.jpg",
      "prepTime": 25,
      "cookTime": 15,
      "servings": 2,
      "difficulty": "easy",
      "category": "Main Course",
      "tags": ["vegetarian", "healthy", "quick"],
      "isPublic": true,
      "nutrition": {
        "totalCalories": 450.0,
        "totalProtein": 25.0,
        "totalFat": 15.0,
        "totalCarbs": 55.0
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 50
  },
  "totalElements": 100
}
```

## Cách trang hoạt động

### 📋 Luồng hoạt động:

```
1. Component mount
   ↓
2. useGetRecipes() gọi API lấy danh sách công thức
   ↓
3. Hiển thị 7 ngày trong tuần (Monday - Sunday)
   ↓
4. User click "Add Recipe" button
   ↓
5. Modal mở ra hiển thị danh sách công thức
   ↓
6. User chọn công thức
   ↓
7. Meal được add vào day state
   ↓
8. Component re-render với meal mới
   ↓
9. User có thể remove meal bằng nút X
```

## Hook được sử dụng

### **useGetRecipes()**
```typescript
const { data: recipesData, isLoading: isLoadingRecipes } = useGetRecipes();
```

**Tính năng:**
- Lấy danh sách tất cả công thức
- Tự động cache trong 5 phút
- Hỗ trợ React Query

**Các state:**
- `data`: Mảng các Recipe
- `isLoading`: Boolean - đang tải không?
- `error`: Error object nếu có lỗi

## Component State Management

### 1. **Days State**
```typescript
const [days, setDays] = useState<Day[]>([...])

// Day object:
{
  name: 'Monday',
  calories: 2100,
  protein: 150,
  fat: 70,
  carbs: 220,
  meals: {
    breakfast: Meal | null,
    lunch: Meal | null,
    dinner: Meal | null,
    snack: Meal | null
  },
  isHighlight?: boolean
}
```

### 2. **Modal State**
```typescript
const [selectedDay, setSelectedDay] = useState<number | null>(null);
const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
const [showModal, setShowModal] = useState(false);
```

## Các Handler Function

### **handleAddMeal(dayIndex, mealType)**
Mở modal để chọn công thức cho bữa ăn cụ thể

```typescript
handleAddMeal(0, 'breakfast')  // Mở modal để chọn breakfast cho Monday
```

### **handleSelectRecipe(recipe)**
Thêm công thức được chọn vào meal plan

```typescript
- Lấy thông tin từ Recipe object
- Tạo Meal object
- Update state
- Đóng modal
```

### **handleRemoveMeal(dayIndex, mealType)**
Xóa meal khỏi day

```typescript
handleRemoveMeal(0, 'breakfast')  // Xóa breakfast của Monday
```

## Dữ liệu được hiển thị

### 1. **Thông tin bữa ăn**
```
- Tên công thức (title)
- Hình ảnh (image)
- Lượng calo (nutrition.totalCalories)
- Nút xóa (hover để thấy)
```

### 2. **Thông tin ngày**
```
- Tên ngày (Monday, Tuesday, ...)
- Tổng calo của ngày
- Macro breakdown:
  - Protein (g)
  - Fat (g)
  - Carbs (g)
```

### 3. **Thống kê tuần**
```
- Grocery Count: Số lượng items cần mua
- Weekly Prep Time: Tổng thời gian chuẩn bị
- Macro Balance: Biểu đồ protein/fat/carbs
- Plan Shared: Chia sẻ meal plan
```

## Modal Recipe Selection

### Tính năng:
- ✅ Tìm kiếm công thức (hiện tại hiển thị tất cả)
- ✅ Hiển thị hình ảnh, tên, mô tả
- ✅ Hiển thị prep time và calories
- ✅ Click để chọn
- ✅ Loading state khi fetch

## Features có thể thêm sau

### 1. **Lưu Meal Plan**
```typescript
// Endpoint cần:
POST /api/v1/meal-plans
```

### 2. **Tìm kiếm công thức trong modal**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const filteredRecipes = recipes.filter(r => 
  r.title.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### 3. **Tính toán Shopping List tự động**
```typescript
// Lấy tất cả ingredients từ selected meals
// Gom nhóm theo danh mục
// Gửi tới Shopping List Page
```

### 4. **Drag & Drop**
```typescript
// Kéo công thức vào meal slot thay vì click
// Kéo reorder meals
```

## Troubleshooting

### ❌ Modal không hiển thị recipes
**Nguyên nhân:** API không trả về dữ liệu
**Giải pháp:** 
- Kiểm tra browser console
- Chắc chắn backend đang chạy
- Kiểm tra `/api/v1/recipes/public` endpoint

### ❌ Image không hiển thị
**Nguyên nhân:** URL hình ảnh không hợp lệ
**Giải pháp:**
- Fallback url: `https://via.placeholder.com/300`
- Kiểm tra recipe.image field

### ❌ Calories không hiển thị
**Nguyên nhân:** nutrition object là null
**Giải pháp:**
- Kiểm tra recipe đã calculate nutrition chưa
- Sử dụng fallback: `0`

## API Flow Diagram

```
┌─────────────────────────────┐
│ WeeklyMealPlannerPage Load  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ useGetRecipes() Hook        │
│ - Query key: ['recipes']    │
│ - Endpoint: /api/v1/recipes │
└──────────────┬──────────────┘
               │
         ┌─────┴─────┐
         ▼           ▼
    ✅ Success   ❌ Error
    (recipes)   (error)
         │           │
         ▼           ▼
    Set state   Show error UI
         │
         ▼
    User interacts
         │
    ┌────┴────┐
    ▼         ▼
 Click       Hover
 Add btn     Remove
    │         │
    ▼         ▼
 Show       Remove
 Modal      meal
```

