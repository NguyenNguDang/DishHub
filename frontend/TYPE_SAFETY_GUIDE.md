# 📝 Type-Safe State Management - Complete Guide

## ✅ Đã Loại Bỏ Tất Cả `any` Types

Tất cả `any` types đã được thay thế bằng các interface cụ thể trong `src/types/index.ts`.

---

## 📦 Type Definitions

### **Recipe Types**
```typescript
// Định dạng công thức
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;          // phút
  prepTime: number;          // phút
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  ingredients: Ingredient[];
  instructions: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Thành phần của công thức
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

// Request tạo công thức mới
export interface CreateRecipeRequest {
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
}

// Request cập nhật công thức
export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {}
```

### **Shopping List Types**
```typescript
// Mục trong danh sách mua sắm
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  addedAt: Date;
}

// Danh sách mua sắm
export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Request tạo mục mới
export interface CreateShoppingListItemRequest {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

// Request cập nhật mục
export interface UpdateShoppingListItemRequest extends Partial<CreateShoppingListItemRequest> {
  isChecked?: boolean;
}
```

### **User Profile Types**
```typescript
// Hồ sơ người dùng
export interface UserProfile extends User {
  bio?: string;
  favoriteRecipes: string[];
  followers: number;
  following: number;
  preferences?: UserPreferences;
}

// Tùy chọn người dùng
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'vi';
  notifications: boolean;
  dietaryRestrictions: string[];
}

// Request cập nhật hồ sơ
export interface UpdateUserProfileRequest extends Partial<Omit<UserProfile, 'id' | 'createdAt'>> {}
```

---

## 🎯 Cách Sử Dụng - Type Safe

### **Query with Strong Types**
```typescript
import { useFetchRecipes, useFetchRecipeDetail } from '@/hooks';
import type { Recipe } from '@/types';

function RecipeComponent() {
  // ✅ data được typed là Recipe[] | undefined
  const { data: recipes, isLoading, error } = useFetchRecipes();
  
  // ✅ data được typed là Recipe | undefined
  const { data: recipe } = useFetchRecipeDetail('123');

  // ✅ TypeScript sẽ check các properties
  if (recipes) {
    recipes.forEach((r: Recipe) => {
      console.log(r.title);      // ✅ string
      console.log(r.prepTime);   // ✅ number
      console.log(r.difficulty); // ✅ 'easy' | 'medium' | 'hard'
    });
  }
}
```

### **Mutation with Strong Types**
```typescript
import { useCreateRecipe, useUpdateRecipe } from '@/hooks';
import type { CreateRecipeRequest, UpdateRecipeRequest } from '@/types';

function AddRecipeForm() {
  // ✅ mutate expects CreateRecipeRequest
  const { mutate: create, isPending } = useCreateRecipe({
    onSuccess: (recipe) => {
      console.log(recipe.id);      // ✅ string
      console.log(recipe.title);   // ✅ string
    },
  });

  const handleSubmit = (formData: CreateRecipeRequest) => {
    // ✅ TypeScript validates all required fields
    create({
      title: 'New Recipe',
      description: 'Description',
      image: 'url',
      cookTime: 30,
      prepTime: 15,
      servings: 4,
      difficulty: 'medium',  // ✅ Only allows specific values
      category: 'lunch',
      tags: ['vegetarian'],
      ingredients: [],
      instructions: [],
    });
  };
}
```

### **Filter with Strong Types**
```typescript
import type { Recipe } from '@/types';

function filterRecipes(recipes: Recipe[], category: string): Recipe[] {
  // ✅ TypeScript knows Recipe interface
  return recipes.filter(recipe => recipe.category === category);
}
```

---

## 🔍 Type Checking Examples

### ❌ WRONG - TypeScript will complain
```typescript
const recipe: Recipe = {
  id: '1',
  title: 'Pasta',
  // ❌ Missing required fields
  // TypeScript Error: Property 'description' is missing
};

const request: CreateRecipeRequest = {
  title: 'Pasta',
  // ❌ Missing required fields
  // TypeScript Error: Property 'description' is missing
};

const difficulty: 'easy' | 'medium' | 'hard' = 'hard';
const recipe2: Recipe = {
  // ...
  difficulty: 'super_hard', // ❌ Not allowed
  // TypeScript Error: Type '"super_hard"' is not assignable to type '"easy" | "medium" | "hard"'
};
```

### ✅ RIGHT - TypeScript approves
```typescript
const recipe: Recipe = {
  id: '1',
  title: 'Pasta',
  description: 'Delicious pasta',
  image: 'url',
  cookTime: 20,
  prepTime: 10,
  servings: 2,
  difficulty: 'easy',
  category: 'lunch',
  tags: ['italian'],
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
  instructions: ['Boil water', 'Add pasta'],
  createdBy: 'user123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const request: CreateRecipeRequest = {
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
};
```

---

## 🛠️ Adding New Types

Khi cần thêm API endpoint mới:

1. **Tạo types trong `src/types/index.ts`:**
```typescript
export interface MyData {
  id: string;
  name: string;
  value: number;
}

export interface CreateMyDataRequest {
  name: string;
  value: number;
}

export interface UpdateMyDataRequest extends Partial<CreateMyDataRequest> {}
```

2. **Tạo hooks trong `src/hooks/useServerState.ts`:**
```typescript
export const useFetchMyData = (options?: UseQueryOptions<MyData[], Error>) => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const res = await fetch('/api/my-data');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    ...options,
  });
};

export const useCreateMyData = (
  options?: UseMutationOptions<MyData, Error, CreateMyDataRequest>
) => {
  return useMutation({
    mutationFn: async (data: CreateMyDataRequest) => {
      const res = await fetch('/api/my-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-data'] });
    },
    ...options,
  });
};
```

---

## 📋 File Structure

```
src/types/
└── index.ts          ← Tất cả type definitions

src/hooks/
└── useServerState.ts ← Tất cả hooks sử dụng types

src/pages/
└── *.tsx             ← Components import types từ src/types
```

---

## ✨ Benefits

✅ **Type Safety** - Phát hiện lỗi tại compile time, không runtime  
✅ **Auto Completion** - IDE suggest properties có sẵn  
✅ **Self Documenting** - Types làm documentation  
✅ **Refactoring Safe** - Thay đổi dễ dàng, TypeScript sẽ báo lỗi  
✅ **Better DX** - Lỗi được catch ngay lập tức  

---

## 🚀 Status: FULLY TYPE-SAFE ✅

Không còn `any` types!

