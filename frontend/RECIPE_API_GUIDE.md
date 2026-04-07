# 🍽️ Recipe Management API - Complete Guide

## 📦 Files Được Tạo

### 1. **API Client** (`src/services/recipeApi.ts`)
- Axios instance configuration
- CRUD methods cho recipes
- Automatic token injection từ localStorage
- Error handling & interceptors

### 2. **React Query Hooks** (`src/hooks/useRecipeApi.ts`)
- `useGetRecipes()` - Fetch danh sách công thức
- `useGetRecipeById(id)` - Fetch chi tiết công thức
- `useSearchRecipes(query)` - Tìm kiếm công thức
- `useGetRecipesByCategory(category)` - Lấy theo danh mục
- `useAddRecipe()` - Tạo công thức mới
- `useUpdateRecipe()` - Cập nhật công thức
- `useDeleteRecipe()` - Xóa công thức

### 3. **Components** 
- `src/components/recipe/RecipeListComponent.tsx` - Hiển thị danh sách
- `src/components/recipe/AddRecipeForm.tsx` - Form thêm công thức

### 4. **Test Page** (`src/pages/RecipeManagementTestPage.tsx`)
- Test page để sử dụng danh sách + form

---

## 🚀 Cách Sử Dụng

### **1. Lấy Danh Sách Công Thức**

```typescript
import { useGetRecipes } from '@/hooks';

function MyComponent() {
  const { data: recipes, isLoading, error } = useGetRecipes();

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <ul>
      {recipes?.map((recipe) => (
        <li key={recipe.id}>{recipe.title}</li>
      ))}
    </ul>
  );
}
```

### **2. Thêm Công Thức Mới**

```typescript
import { useAddRecipe } from '@/hooks';
import type { CreateRecipeRequest } from '@/types';

function AddForm() {
  const { mutate: addRecipe, isPending } = useAddRecipe();

  const handleSubmit = (data: CreateRecipeRequest) => {
    addRecipe(data, {
      onSuccess: (newRecipe) => {
        console.log('Thêm thành công:', newRecipe);
        // Danh sách sẽ tự động cập nhật nhờ queryClient.invalidateQueries
      },
      onError: (error) => {
        console.error('Lỗi:', error);
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        title: 'Pasta',
        description: 'Delicious pasta',
        image: 'url',
        cookTime: 20,
        prepTime: 10,
        servings: 2,
        difficulty: 'easy',
        category: 'lunch',
        tags: ['italian'],
        ingredients: [],
        instructions: [],
      });
    }}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? 'Đang thêm...' : 'Thêm'}
      </button>
    </form>
  );
}
```

### **3. Cập Nhật Công Thức**

```typescript
import { useUpdateRecipe } from '@/hooks';
import type { UpdateRecipeRequest } from '@/types';

function EditForm({ recipeId }: { recipeId: string }) {
  const { mutate: updateRecipe, isPending } = useUpdateRecipe();

  const handleSubmit = (data: UpdateRecipeRequest) => {
    updateRecipe(
      { id: recipeId, data },
      {
        onSuccess: () => {
          console.log('Cập nhật thành công');
        },
      }
    );
  };

  return (
    // form fields
  );
}
```

### **4. Xóa Công Thức**

```typescript
import { useDeleteRecipe } from '@/hooks';

function RecipeCard({ recipeId }: { recipeId: string }) {
  const { mutate: deleteRecipe, isPending } = useDeleteRecipe();

  return (
    <button
      onClick={() => {
        if (confirm('Xóa công thức này?')) {
          deleteRecipe(recipeId, {
            onSuccess: () => alert('Xóa thành công'),
          });
        }
      }}
      disabled={isPending}
    >
      {isPending ? 'Đang xóa...' : 'Xóa'}
    </button>
  );
}
```

### **5. Tìm Kiếm Công Thức**

```typescript
import { useSearchRecipes } from '@/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearchRecipes(query);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm..."
      />
      {isLoading && <div>Đang tìm kiếm...</div>}
      {results?.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </>
  );
}
```

### **6. Lấy Theo Danh Mục**

```typescript
import { useGetRecipesByCategory } from '@/hooks';

function CategoryComponent() {
  const { data: recipes } = useGetRecipesByCategory('lunch');

  return (
    <div>
      {recipes?.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  );
}
```

---

## 🔧 Cấu Hình API Client

### Thay đổi Base URL

```typescript
// src/services/recipeApi.ts
const recipeApiClient = new RecipeApiClient(
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
);
```

### Thêm Auth Token

Token sẽ tự động thêm vào header từ localStorage:

```typescript
// Lưu token
localStorage.setItem('accessToken', 'your_token_here');

// Token sẽ được tự động thêm vào tất cả requests
// Header: Authorization: Bearer your_token_here
```

### Handle Errors

```typescript
const { mutate: addRecipe } = useAddRecipe({
  onError: (error: AxiosError) => {
    if (error.response?.status === 400) {
      // Validation error
    } else if (error.response?.status === 401) {
      // Unauthorized - redirect to login
    } else if (error.response?.status === 500) {
      // Server error
    }
  },
});
```

---

## 📋 API Endpoints

### Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Lấy danh sách |
| GET | `/api/recipes/{id}` | Lấy chi tiết |
| POST | `/api/recipes` | Tạo mới |
| PUT | `/api/recipes/{id}` | Cập nhật |
| DELETE | `/api/recipes/{id}` | Xóa |
| GET | `/api/recipes/search?q=query` | Tìm kiếm |
| GET | `/api/recipes/category?category=lunch` | Theo danh mục |

---

## 🧪 Testing

### Test Page URL
```
http://localhost:5173/recipe-management-test
```

### Mock Data cho Testing

Nếu backend chưa sẵn sàng, có thể mock API:

```typescript
// src/services/recipeApi.ts - Thêm mock data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta',
    image: 'https://...',
    cookTime: 20,
    prepTime: 10,
    servings: 2,
    difficulty: 'easy',
    category: 'lunch',
    tags: ['italian', 'pasta'],
    rating: 4.5,
    reviews: 10,
    ingredients: [
      {
        id: '1',
        name: 'Pasta',
        quantity: 400,
        unit: 'g',
      },
    ],
    instructions: ['Boil pasta', 'Cook bacon', 'Mix everything'],
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Modify getRecipes() để trả về mock data
async getRecipes(): Promise<Recipe[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRecipes), 500);
  });
}
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component (RecipeListComponent, AddRecipeForm)
    ↓
React Query Hook (useGetRecipes, useAddRecipe, etc.)
    ↓
Axios API Client (recipeApiClient)
    ↓
Backend API (http://localhost:8080/api)
    ↓
Response
    ↓
React Query caches data
    ↓
Component re-renders
    ↓
UI updated
```

---

## 💡 Best Practices

✅ **Always use hooks** - Không gọi API trực tiếp  
✅ **Handle loading states** - Show spinners khi fetch  
✅ **Handle errors** - Display error messages  
✅ **Invalidate cache** - Tự động được làm trong mutations  
✅ **Type everything** - Sử dụng TypeScript types  
✅ **Disable buttons during mutation** - Use `isPending` flag  

---

## 🐛 Troubleshooting

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend cần enable CORS
```java
// Spring Boot
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("GET", "POST", "PUT", "DELETE");
      }
    };
  }
}
```

### 404 Not Found
```
Error: 404 Not Found
```
**Solution:** Kiểm tra API URL và endpoints có chính xác không

### Unauthorized
```
Error: 401 Unauthorized
```
**Solution:** Lưu auth token vào localStorage hoặc thêm logic authentication

---

## 📚 Files Summary

```
src/
├── services/
│   └── recipeApi.ts              ← Axios API Client
├── hooks/
│   ├── useRecipeApi.ts           ← React Query Hooks
│   └── index.ts                  ← Updated exports
├── components/recipe/
│   ├── RecipeListComponent.tsx   ← List component
│   └── AddRecipeForm.tsx         ← Form component
├── pages/
│   └── RecipeManagementTestPage.tsx ← Test page
└── types/
    └── index.ts                  ← Type definitions
```

---

## ✨ Features

✅ Full CRUD operations  
✅ React Query caching  
✅ Automatic cache invalidation  
✅ Search functionality  
✅ Category filtering  
✅ Error handling  
✅ Loading states  
✅ Type-safe  
✅ Interceptor support  
✅ Auth token injection  

---

## 🚀 Next Steps

1. Setup backend API endpoints
2. Update `recipeApiClient` baseURL
3. Implement auth if needed
4. Add more hooks as needed (favorites, ratings, etc.)
5. Add error toast notifications
6. Setup React Query DevTools for debugging
7. Add pagination
8. Add infinite scroll


