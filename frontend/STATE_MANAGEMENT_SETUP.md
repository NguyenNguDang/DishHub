# State Management Setup - DishHub

## ✅ Cấu hình hoàn tất

Dự án DishHub đã được setup hoàn toàn với **Zustand** (Client State) + **React Query** (Server State).

---

## 📦 Các file được tạo

### 1. **`src/config/queryClient.ts`** - Cấu hình React Query
- Định nghĩa QueryClient với các thiết lập mặc định
- `staleTime`: 5 phút (dữ liệu được coi là tươi trong 5 phút)
- `gcTime`: 10 phút (dữ liệu được giữ trong bộ nhớ 10 phút)
- `retry`: 1 lần thử lại khi có lỗi

### 2. **`src/store/useAppStore.ts`** - Zustand Store
- **UI State**: `isSidebarOpen`, `isModalOpen`
- **Filter State**: `selectedCategory`, `searchQuery`
- Các action để cập nhật state

### 3. **`src/hooks/useServerState.ts`** - Custom Hooks cho API
Các hooks sẵn sàng sử dụng:
- `useFetchRecipes()` - Lấy danh sách công thức
- `useFetchRecipeDetail(id)` - Lấy chi tiết công thức
- `useCreateRecipe()` - Tạo công thức mới (mutation)
- `useUpdateRecipe()` - Cập nhật công thức (mutation)
- `useDeleteRecipe()` - Xóa công thức (mutation)
- `useFetchShoppingList()` - Lấy danh sách mua sắm
- `useFetchUserProfile()` - Lấy hồ sơ người dùng
- `useUpdateUserProfile()` - Cập nhật hồ sơ (mutation)

### 4. **`src/pages/RecipeListExample.tsx`** - Ví dụ Component
Component mẫu cho thấy cách sử dụng cả Zustand và React Query.

---

## 🚀 Cách sử dụng

### **Client State (Zustand)** - cho UI state
```typescript
import { useAppStore } from '@/store';

const MyComponent = () => {
  const { isSidebarOpen, toggleSidebar, searchQuery, setSearchQuery } = useAppStore();

  return (
    <>
      <button onClick={toggleSidebar}>
        Sidebar: {isSidebarOpen ? 'Mở' : 'Đóng'}
      </button>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
    </>
  );
};
```

### **Server State (React Query)** - cho API data
```typescript
import { useFetchRecipes, useCreateRecipe } from '@/hooks';

const RecipeComponent = () => {
  // Query (lấy dữ liệu)
  const { data: recipes, isLoading, error } = useFetchRecipes();

  // Mutation (tạo dữ liệu)
  const { mutate: createRecipe } = useCreateRecipe({
    onSuccess: () => {
      alert('Công thức đã được tạo!');
    }
  });

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
      <button onClick={() => createRecipe({ title: 'New' })}>
        Tạo công thức
      </button>
    </div>
  );
};
```

---

## 📋 Sự khác biệt

| Loại | Zustand (Client) | React Query (Server) |
|------|-----------------|---------------------|
| **Mục đích** | UI state, filter, modal | API data |
| **Dữ liệu** | UI settings, local filters | Server data |
| **Caching** | Manual | Automatic |
| **Sync** | N/A | Tự động sync với server |
| **Ví dụ** | isSidebarOpen, searchQuery | recipes, userProfile |

---

## 🔧 Thêm Custom Hooks mới

Nếu cần thêm API endpoint mới, thêm vào `src/hooks/useServerState.ts`:

```typescript
export const useFetchMyData = (options?: UseQueryOptions) => {
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
```

---

## 💡 Best Practices

1. ✅ Dùng **Zustand** cho UI state (sidebar, modal, filters)
2. ✅ Dùng **React Query** cho dữ liệu từ server
3. ✅ Sử dụng query invalidation khi cần refresh data
4. ✅ Xử lý loading và error states trong components
5. ✅ Không lạm dụng store - chỉ dùng khi cần share state toàn app

---

## 🔗 Liên kết

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Query Docs](https://tanstack.com/query/latest)

