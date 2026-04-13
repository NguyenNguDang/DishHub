# ✅ Weekly Meal Planner - API Integration Complete

## 📝 Những thay đổi thực hiện

### 1. **Import Hook API**
```typescript
import { useGetRecipes } from '../hooks/useRecipeApi';
```
- Lấy hook từ `useRecipeApi.ts`
- Hook sử dụng React Query để fetch danh sách công thức

### 2. **API Được Gọi**
```
GET /api/v1/recipes/public
```
- Endpoint: `http://localhost:8080/api/v1/recipes/public`
- Method: GET
- Pageable: page=0, size=50 (mặc định)
- Response: Page<RecipeResponse>

### 3. **Component State**
```typescript
// Lấy dữ liệu từ API
const { data: recipesData, isLoading: isLoadingRecipes } = useGetRecipes();
const recipes = useMemo(() => recipesData || [], [recipesData]);

// Modal state
const [selectedDay, setSelectedDay] = useState<number | null>(null);
const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
const [showModal, setShowModal] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// Meal plan state
const [days, setDays] = useState<Day[]>([...7 days]);
```

### 4. **Handlers Được Thêm**
```typescript
// Mở modal để chọn công thức
handleAddMeal(dayIndex, mealType)

// Chọn công thức từ modal
handleSelectRecipe(recipe)

// Xóa bữa ăn
handleRemoveMeal(dayIndex, mealType)
```

### 5. **Modal Functionality**
- ✅ Hiển thị danh sách công thức từ API
- ✅ Search functionality (tìm kiếm theo title hoặc description)
- ✅ Loading state
- ✅ Error state (no recipes)
- ✅ Hiển thị: ảnh, tên, mô tả, prep time, calories
- ✅ Click để chọn

## 🎯 Cách sử dụng

### Bước 1: Click "Add Recipe"
```
Nhấn vào nút "Add Recipe" ở bất kỳ meal slot nào
```

### Bước 2: Modal mở ra
```
- Hiển thị danh sách công thức từ API
- Có search bar để tìm kiếm
```

### Bước 3: Tìm kiếm (optional)
```
- Gõ tên công thức vào search box
- Danh sách sẽ filter theo tên hoặc mô tả
```

### Bước 4: Chọn công thức
```
- Click vào công thức muốn thêm
- Modal đóng lại
- Công thức được thêm vào meal slot
```

### Bước 5: Xóa (optional)
```
- Hover vào meal đã thêm
- Nút X sẽ hiện ra
- Click X để xóa
```

## 📊 Dữ liệu Hiển Thị

### Từ Recipe Object:
```typescript
{
  id: number;
  title: string;          // Tên công thức
  description: string;    // Mô tả
  image: string;          // URL hình ảnh
  prepTime: number;       // Thời gian chuẩn bị (phút)
  nutrition: {
    totalCalories: number;  // Calories
    totalProtein: number;
    totalFat: number;
    totalCarbs: number;
  }
}
```

## ✨ Summary

**Weekly Meal Planner** page đã được tích hợp hoàn toàn với API

