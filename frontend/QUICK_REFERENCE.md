# 📖 Quick Reference - State Management

## 🔗 File Structure
```
frontend/
├── src/
│   ├── config/
│   │   └── queryClient.ts          ← React Query config
│   ├── store/
│   │   ├── useAppStore.ts          ← Zustand store
│   │   └── index.ts                ← Exports
│   ├── hooks/
│   │   ├── useServerState.ts       ← API hooks
│   │   └── index.ts                ← Exports
│   ├── pages/
│   │   └── RecipeListExample.tsx   ← Example component
│   └── main.tsx                    ← QueryClientProvider wrapper
```

---

## 🎯 Common Patterns

### Pattern 1: Fetch Data + Filter Locally
```typescript
import { useAppStore } from '@/store';
import { useFetchRecipes } from '@/hooks';

export const RecipesPage = () => {
  const { searchQuery } = useAppStore();
  const { data: recipes } = useFetchRecipes();
  
  const filtered = recipes?.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return <div>{/* render filtered */}</div>;
};
```

### Pattern 2: Create with Success Toast
```typescript
import { useCreateRecipe } from '@/hooks';
import toast from 'react-hot-toast'; // or similar

export const AddRecipeForm = () => {
  const { mutate: create, isPending } = useCreateRecipe({
    onSuccess: () => {
      toast.success('Công thức được tạo!');
      // Redirect or close form
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      create({ /* form data */ });
    }}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? 'Đang tạo...' : 'Tạo'}
      </button>
    </form>
  );
};
```

### Pattern 3: Update Form
```typescript
import { useFetchRecipeDetail, useUpdateRecipe } from '@/hooks';

export const EditRecipeForm = ({ recipeId }: { recipeId: string }) => {
  const { data: recipe, isLoading } = useFetchRecipeDetail(recipeId);
  const { mutate: update, isPending } = useUpdateRecipe();

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      update({ id: recipeId, data: { /* form data */ } });
    }}>
      <input defaultValue={recipe?.title} />
      <button disabled={isPending}>Lưu</button>
    </form>
  );
};
```

### Pattern 4: Optimistic Update (Pending UI)
```typescript
import { useUpdateRecipe } from '@/hooks';

export const RatingButton = ({ recipeId, currentRating }: Props) => {
  const { mutate: update, isPending } = useUpdateRecipe();

  return (
    <div
      onClick={() => update({ id: recipeId, data: { rating: 5 } })}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      ⭐ {isPending ? 'Cập nhật...' : 'Rate'}
    </div>
  );
};
```

---

## 🔍 Query Debugging

### Using React Query DevTools (recommended)
```bash
npm install @tanstack/react-query-devtools
```

```typescript
// main.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## ⚠️ Common Mistakes

❌ **WRONG**: Direct API call instead of hook
```typescript
const [recipes, setRecipes] = useState([]);

useEffect(() => {
  fetch('/api/recipes')
    .then(r => r.json())
    .then(data => setRecipes(data));
}, []);
```

✅ **RIGHT**: Use React Query hook
```typescript
const { data: recipes } = useFetchRecipes();
```

---

❌ **WRONG**: Store server data in Zustand
```typescript
const useAppStore = create((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),
}));
```

✅ **RIGHT**: Use React Query for server data
```typescript
const { data: recipes } = useFetchRecipes();
```

---

❌ **WRONG**: Forgot to invalidate cache
```typescript
const { mutate: create } = useCreateRecipe({
  onSuccess: () => {
    // Missing: queryClient.invalidateQueries()
    navigate('/recipes');
  },
});
```

✅ **RIGHT**: Invalidate related queries
```typescript
const { mutate: create } = useCreateRecipe({
  onSuccess: () => {
    // Query will auto-refetch
    navigate('/recipes');
  },
});
```

---

## 🛠️ Custom Hook Template

```typescript
// src/hooks/useServerState.ts

export const useMyCustomQuery = (
  params?: MyParams, 
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: ['my-data', params?.id],
    queryFn: async () => {
      const res = await fetch(`/api/my-data/${params?.id}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!params?.id,
    ...options,
  });
};

export const useMyCustomMutation = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async (data: MyData) => {
      const res = await fetch('/api/my-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
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

## 📱 Component with All States

```typescript
export const MyComponent = () => {
  // Server State
  const { data, isLoading, error } = useFetchRecipes();
  const { mutate: create, isPending } = useCreateRecipe();

  // Client State
  const { searchQuery, setSearchQuery } = useAppStore();

  if (isLoading) return <Skeleton />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        onClick={() => create({ title: 'New' })}
        disabled={isPending}
      >
        {isPending ? 'Creating...' : 'Create'}
      </button>
      <List items={data} />
    </div>
  );
};
```

---

## 🚀 Ready to Use!

Tất cả đã setup xong. Hãy:
1. Import hooks từ `@/hooks`
2. Import store từ `@/store`
3. Build components!

