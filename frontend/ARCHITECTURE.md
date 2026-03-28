# 🍳 DishHub Frontend Architecture Guide

## 📋 Tổng Quan Cấu Trúc

```
src/
├── assets/               # Hình ảnh, icon, font
├── components/           # Các component tái sử dụng
│   ├── layout/          # Layout components (Header, Sidebar, MainLayout)
│   ├── common/          # Common UI components (Button, Input, Modal...)
│   ├── recipe/          # Recipe-specific components
│   └── auth/            # Auth components
├── pages/               # Các trang chính
├── hooks/               # Custom React hooks
├── services/            # API calls & business logic
├── store/               # State management (future)
├── router/              # React Router configuration
├── types/               # TypeScript interfaces & types
├── utils/               # Helper functions & constants
├── styles/              # Global styles
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

---

## 🎯 Cấu Trúc Chi Tiết

### 1. **Components** (`src/components/`)

#### **Layout Components** (`layout/`)
- **Header.tsx**: Thanh header với logo, search bar, user actions
- **Sidebar.tsx**: Menu sidebar với danh mục, navigation
- **MainLayout.tsx**: Layout chính kết hợp Header + Sidebar + Main Content

**Ví dụ sử dụng:**
```tsx
<MainLayout 
  isLoggedIn={isLoggedIn} 
  userName="John Doe"
  onLogout={() => logout()}
>
  <YourPageContent />
</MainLayout>
```

#### **Common Components** (`common/`)
- **Button.tsx**: Nút tùy chỉnh (primary, secondary, outline, danger)
- **Input.tsx**: Input field với label, error message
- **Modal.tsx**: Modal dialog component
- **Spinner.tsx**: Loading spinner
- **NavLink.tsx**: Navigation link với active state, badge

**Ví dụ sử dụng:**
```tsx
import { Button, Input, Modal } from '@/components/common';

<Button variant="primary" onClick={handleClick}>Đăng nhập</Button>
<Input label="Email" type="email" error={error} />
```

### 2. **Pages** (`src/pages/`)

Các trang chính của ứng dụng:
- `LoginPage.tsx` - Trang đăng nhập
- `RegisterPage.tsx` - Trang đăng ký
- `RecipeExplorerPage.tsx` - Khám phá công thức
- `RecipeDetailPage.tsx` - Chi tiết công thức
- `ShoppingListPage.tsx` - Danh sách mua hàng
- `UserProfilePage.tsx` - Hồ sơ người dùng
- `WeeklyMealPlannerPage.tsx` - Lên kế hoạch bữa ăn
- `NotFoundPage.tsx` - Trang 404

### 3. **Router** (`src/router/`)

**routes.tsx**: Cấu hình tất cả routes với React Router v6

```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}
```

### 4. **Types** (`src/types/`)

**index.ts**: Các TypeScript interfaces

```tsx
// User & Auth
interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

// Recipe
interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  // ... more fields
}

// API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 5. **Services** (`src/services/`)

Xử lý API calls và business logic:

- **api.ts**: Base API client với GET, POST, PUT, DELETE
- **authService.ts**: Auth-related API calls (login, register, logout)
- **recipeService.ts**: Recipe-related API calls (CRUD)

**Ví dụ sử dụng:**
```tsx
import { recipeService } from '@/services';

// Fetch recipes
const recipes = await recipeService.getAll(1, 12);

// Get single recipe
const recipe = await recipeService.getById('recipe-id');

// Search recipes
const results = await recipeService.search('pasta');
```

### 6. **Hooks** (`src/hooks/`)

Custom React hooks:

- **useAuth.ts**: Quản lý auth state (login, logout, user info)
- **useFetch.ts**: Generic hook để fetch data từ API
- **useLocalStorage.ts**: Hook để sử dụng localStorage

**Ví dụ sử dụng:**
```tsx
import { useAuth } from '@/hooks';

function MyComponent() {
  const { isLoggedIn, user, login, logout } = useAuth();
  
  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Hello, {user?.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 7. **Utils** (`src/utils/`)

**constants.ts**: Các hằng số
```tsx
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  RECIPES: '/recipes',
  // ...
};

export const RECIPE_CATEGORIES = [
  { id: 'vietnamese', label: 'Các món ăn Việt', icon: '🍜' },
  { id: 'vegetarian', label: 'Ăn chay', icon: '🥗' },
  // ...
];
```

**formatters.ts**: Hàm format dữ liệu
```tsx
formatTime(90)        // "1h 30m"
formatDate(new Date()) // "28 Tháng 3, 2026"
truncateText(text, 50) // "Đây là text dài được cắt ngắn..."
```

**validators.ts**: Hàm validate
```tsx
isValidEmail('user@example.com')   // true
isValidPassword('123456')           // true
validateRecipeForm(recipe)          // ["error1", "error2"]
```

---

## 🚀 Quick Start

### Cài đặt dependencies
```bash
cd frontend
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

---

## 📝 Ví dụ: Tạo Page Mới

### 1. Tạo page component
```tsx
// src/pages/MyNewPage.tsx
import { MainLayout } from '@/components';
import { useAuth } from '@/hooks';

export const MyNewPage = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      userName={user?.username}
      onLogout={logout}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My New Page</h1>
        {/* Your content here */}
      </div>
    </MainLayout>
  );
};
```

### 2. Thêm route
```tsx
// src/router/routes.tsx
{
  path: '/my-new-page',
  element: <MyNewPage />,
}
```

### 3. Thêm navigation
```tsx
// src/components/layout/Sidebar.tsx
const navItems: NavItem[] = [
  // ... existing items
  { label: 'My New Page', path: '/my-new-page', icon: '⭐' },
];
```

---

## 🎨 Tailwind CSS Classes

Ứng dụng sử dụng Tailwind CSS v4 cho styling:

```tsx
// Spacing
className="p-4 m-2 gap-4 space-y-6"

// Colors
className="bg-blue-600 text-white hover:bg-blue-700"

// Typography
className="text-xl font-bold text-gray-900"

// Responsive
className="px-4 sm:px-6 lg:px-8"

// Flexbox
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## 🔐 Authentication Flow

1. **Login**
   ```tsx
   const { login } = useAuth();
   await login('user@example.com', 'password');
   // Header & Sidebar update automatically
   ```

2. **Logout**
   ```tsx
   const { logout } = useAuth();
   logout();
   // Redirect to home page
   ```

3. **Protected Routes** (Future Implementation)
   ```tsx
   <ProtectedRoute>
     <UserProfilePage />
   </ProtectedRoute>
   ```

---

## 🐛 Development Tips

1. **Use TypeScript strict mode** - Tất cả file phải có type annotations
2. **Keep components small** - Chia component thành nhỏ hơn cho tái sử dụng
3. **Use custom hooks** - Tách logic ra custom hooks để test và tái sử dụng
4. **Follow naming conventions**:
   - Components: PascalCase (e.g., `RecipeCard.tsx`)
   - Utilities/Services: camelCase (e.g., `formatTime.ts`)
   - Exports: Named exports cho components, default exports cho pages

5. **Import from barrel files**:
   ```tsx
   // Good ✅
   import { Button, Input } from '@/components/common';
   import { useAuth } from '@/hooks';

   // Avoid ❌
   import Button from '@/components/common/Button';
   ```

---

## 🔗 API Integration

### Environment Variables
Tạo `.env.local` file:
```env
VITE_API_URL=http://localhost:8080/api
```

### API Endpoints
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/recipes
GET    /api/recipes/:id
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id
GET    /api/recipes/search?q=query
```

---

## 📦 Dependencies

- **React 19**: UI library
- **React Router DOM v7**: Routing
- **TypeScript 5.9**: Type safety
- **Tailwind CSS 4**: Styling
- **Vite 8**: Build tool

---

## 🎯 Next Steps

1. ✅ Create folder structure and layout components
2. ✅ Set up routing with React Router v6
3. ✅ Create common UI components
4. ✅ Add custom hooks and services
5. ⏳ Implement state management (Zustand/Context API)
6. ⏳ Add form validation with Zod/Yup
7. ⏳ Set up unit testing with Vitest
8. ⏳ Add error boundary and logging
9. ⏳ Implement authentication token persistence
10. ⏳ Add dark mode support

---

## 📞 Support

For questions or issues, please refer to:
- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org
