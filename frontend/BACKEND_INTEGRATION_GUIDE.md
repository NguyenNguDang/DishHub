# 🔌 Backend Integration Guide - DishHub Recipe API

## 📋 Summary - Các chức năng đã kết nối

### ✅ Đã Hoàn Thành

#### 1. **Tạo Công Thức (POST /recipes)**
- **File**: `AddRecipePage.tsx`
- **Hook**: `useAddRecipe()` - từ `useRecipeApi.ts`
- **Service**: `recipeService.create(recipe)`
- **API**: `POST /api/v1/recipes`
- **Trạng thái**: ✅ READY - Có loading, error handling, success message
- **Điều hướng**: Sau khi tạo thành công → `/my-recipes`

#### 2. **Cập Nhật Công Thức (PUT /recipes/:id)**
- **File**: `MyRecipesPage.tsx` - `handleTogglePublic()` function
- **Hook**: `useUpdateRecipe()` - từ `useRecipeApi.ts`
- **Service**: `recipeService.update(id, recipe)`
- **API**: `PUT /api/v1/recipes/:id`
- **Trạng thái**: ✅ READY - Có loading, error handling
- **Chức năng**: Cập nhật trạng thái public/private của recipe

#### 3. **Xóa Công Thức (DELETE /recipes/:id)**
- **File**: `MyRecipesPage.tsx` - `handleDeleteRecipe()` function
- **Hook**: `useDeleteRecipe()` - từ `useRecipeApi.ts`
- **Service**: `recipeService.delete(id)`
- **API**: `DELETE /api/v1/recipes/:id`
- **Trạng thái**: ✅ READY - Có confirmation modal, error handling
- **UX**: Xác nhận trước khi xóa, kiểm tra `isPending` state

---

## 🏗️ Architecture Overview

### Frontend Flow (Luồng hoạt động Frontend)

```
User Action (Form submit / Click button)
    ↓
Page Component (AddRecipePage / MyRecipesPage)
    ↓
useRecipeApi Hook (useAddRecipe / useUpdateRecipe / useDeleteRecipe)
    ↓
React Query useMutation
    ↓
recipeService (recipeService.create/update/delete)
    ↓
Axios Instance (api.ts) + Interceptor (JWT token)
    ↓
Backend API Endpoint
    ↓
Response + Cache Invalidation
    ↓
UI Update
```

### Folder Structure

```
frontend/src/
├── pages/
│   ├── AddRecipePage.tsx          ← Tạo công thức mới
│   ├── MyRecipesPage.tsx          ← Quản lý công thức (edit/delete)
│   └── RecipeDetailPage.tsx       ← Xem chi tiết
├── services/
│   ├── api.ts                     ← Axios instance + interceptors
│   ├── recipeService.ts           ← API methods (create/update/delete/getAll/etc)
│   └── authService.ts             ← Auth API methods
├── hooks/
│   └── useRecipeApi.ts            ← React Query hooks (useAddRecipe/useUpdateRecipe/etc)
├── types/
│   └── index.ts                   ← TypeScript interfaces
└── store/
    └── useAuthStore.ts            ← Zustand auth store
```

---

## 📡 API Endpoints Tương Ứng

### ✅ Created (Recipes)

| HTTP | Endpoint | Hook | Service | Status |
|------|----------|------|---------|--------|
| POST | `/api/v1/recipes` | `useAddRecipe()` | `recipeService.create()` | ✅ |
| PUT | `/api/v1/recipes/:id` | `useUpdateRecipe()` | `recipeService.update()` | ✅ |
| DELETE | `/api/v1/recipes/:id` | `useDeleteRecipe()` | `recipeService.delete()` | ✅ |

### ✅ Query (Recipes)

| HTTP | Endpoint | Hook | Service | Status |
|------|----------|------|---------|--------|
| GET | `/api/v1/recipes` | `useGetRecipes()` | `recipeService.getAll()` | ✅ |
| GET | `/api/v1/recipes/:id` | `useGetRecipeById()` | `recipeService.getById()` | ✅ |
| GET | `/api/v1/recipes?userId=me` | `useGetUserRecipes()` | `recipeService.getUserRecipes()` | ✅ |
| GET | `/api/v1/recipes/search?query=...` | `useSearchRecipes()` | `recipeService.search()` | ✅ |
| GET | `/api/v1/recipes/category?category=...` | `useGetRecipesByCategory()` | `recipeService.getByCategory()` | ✅ |

---

## 🚀 Cách Sử Dụng

### 1. Tạo Công Thức (AddRecipePage.tsx)

```typescriptreact
import { useAddRecipe } from '../hooks/useRecipeApi';
import type { CreateRecipeRequest } from '../types';

const AddRecipePage = () => {
  const addRecipeMutation = useAddRecipe();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const recipeData: CreateRecipeRequest = {
      title: 'Phở Bò',
      description: 'Phở bò ngon',
      image: 'https://...',
      difficulty: 'medium',
      cookTime: 30,
      prepTime: 10,
      servings: 2,
      category: 'Soup',
      tags: ['Vietnamese', 'Beef'],
      ingredients: [],
      instructions: [],
    };
    
    try {
      // Tự động gọi API POST /api/v1/recipes
      await addRecipeMutation.mutateAsync(recipeData);
      
      // After success:
      // - Cache được invalidate
      // - Component re-render
      // - User được redirect
      navigate('/my-recipes');
    } catch (error) {
      // Error handling
      console.error('Failed to create recipe:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

### 2. Xóa Công Thức (MyRecipesPage.tsx)

```typescriptreact
import { useDeleteRecipe } from '../hooks/useRecipeApi';

const handleDeleteRecipe = async (recipeId: string) => {
  try {
    // Tự động gọi API DELETE /api/v1/recipes/:id
    await deleteRecipeMutation.mutateAsync(recipeId);
    
    // After success:
    // - Cache được invalidate
    // - Công thức bị xóa khỏi list
    console.log('✅ Recipe deleted');
  } catch (err) {
    console.error('❌ Failed to delete:', err);
  }
};
```

### 3. Cập Nhật Công Thức (MyRecipesPage.tsx)

```typescriptreact
import { useUpdateRecipe } from '../hooks/useRecipeApi';

const handleTogglePublic = async (recipe: Recipe) => {
  try {
    // Tự động gọi API PUT /api/v1/recipes/:id
    await updateRecipeMutation.mutateAsync({
      id: recipe.id,
      data: {
        ...recipe,
        isPublic: !recipe.isPublic,
      },
    });
    
    // After success:
    // - Cache được invalidate
    // - UI cập nhật tự động
    console.log('✅ Recipe updated');
  } catch (err) {
    console.error('❌ Failed to update:', err);
  }
};
```

---

## 🔐 Authentication & Authorization

### Token Management

```typescript
// api.ts - Axios Interceptor tự động thêm token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor xử lý 401 error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Token Storage
- **Stored in**: `localStorage.accessToken`
- **Auto injected**: By axios interceptor
- **Auto removed**: On 401 error

---

## ⚙️ React Query Integration

### Cache Management

```typescript
// Automatic cache invalidation on mutation success
onSuccess: (newRecipe: Recipe) => {
  // Invalidate thay đổi query key
  queryClient.invalidateQueries({ queryKey: ['recipes'] });
  
  // Set cache cho recipe chi tiết
  queryClient.setQueryData(['recipe', newRecipe.id], newRecipe);
};
```

### Stale Time & GC Time

```typescript
staleTime: 1000 * 60 * 5,   // 5 phút - Data còn "fresh"
gcTime: 1000 * 60 * 10,     // 10 phút - Keep in cache
```

---

## 🧪 Testing Checklist

### ✅ Test Cases

- [ ] **Create Recipe**
  - [ ] Form validation (title, description required)
  - [ ] Loading state (button disabled, spinner shows)
  - [ ] Success message displays
  - [ ] Redirect to `/my-recipes` after 1 second
  - [ ] Error handling (show error message)

- [ ] **Update Recipe**
  - [ ] Toggle public/private works
  - [ ] Cache invalidates
  - [ ] List updates automatically
  - [ ] Error handling works

- [ ] **Delete Recipe**
  - [ ] Confirmation modal shows
  - [ ] Cancel button closes modal
  - [ ] Delete button removes recipe
  - [ ] Loading state during deletion
  - [ ] List updates automatically

- [ ] **Token Handling**
  - [ ] Token auto-added to requests
  - [ ] 401 redirects to login
  - [ ] Token in localStorage

---

## 🐛 Troubleshooting

### Issue: "Cannot find module recipeService"
**Solution**: File đã được update, kiểm tra import path

### Issue: 404 error khi call API
**Solution**: Backend endpoint không tồn tại hoặc path sai
- Check: `API_BASE_URL` ở `api.ts`
- Check: Backend endpoint naming

### Issue: 401 Unauthorized
**Solution**: Token không được gửi hoặc đã hết hạn
- Check: Token lưu ở localStorage
- Check: Axios interceptor hoạt động
- Re-login để lấy token mới

### Issue: Data không cập nhật sau mutation
**Solution**: Cache không invalidate
- Check: `onSuccess` callback trong hook
- Check: Query key phải match

---

## 📝 Summary

| Feature | Page | Hook | Service | Status |
|---------|------|------|---------|--------|
| Create | AddRecipePage | useAddRecipe | create | ✅ |
| Read | RecipeExplorerPage | useGetRecipes | getAll | ✅ |
| Read (Detail) | RecipeDetailPage | useGetRecipeById | getById | ✅ |
| Update | MyRecipesPage | useUpdateRecipe | update | ✅ |
| Delete | MyRecipesPage | useDeleteRecipe | delete | ✅ |
| Search | RecipeExplorerPage | useSearchRecipes | search | ✅ |
| Filter | RecipeExplorerPage | useGetRecipesByCategory | getByCategory | ✅ |
| User Recipes | MyRecipesPage | useGetUserRecipes | getUserRecipes | ✅ |

---

## 🎯 Next Steps

1. **Test tất cả endpoints** trên postman hoặc browser
2. **Implement Edit Page** (chưa có, cần tạo)
3. **Add ingredients management** UI
4. **Add instructions management** UI
5. **File upload** cho recipe images
6. **Paginate large lists** (hiện dùng limit=100)


