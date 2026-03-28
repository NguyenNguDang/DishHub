# 🍳 DishHub - Frontend React

> Ứng dụng quản lý công thức nấu ăn hiện đại với React, TypeScript và Tailwind CSS

## 📸 Tính Năng

- ✅ **Khám phá công thức**: Tìm kiếm và duyệt công thức nấu ăn
- ✅ **Chi tiết công thức**: Xem nguyên liệu, hướng dẫn chi tiết
- ✅ **Danh sách mua sắm**: Tạo danh sách mua hàng từ công thức
- ✅ **Lên kế hoạch bữa ăn**: Lên kế hoạch bữa ăn cho cả tuần
- ✅ **Hồ sơ người dùng**: Quản lý thông tin cá nhân
- ✅ **Responsive Design**: Hoạt động trên mọi thiết bị

## 🛠️ Tech Stack

| Technology | Version | Mục Đích |
|-----------|---------|---------|
| React | 19.2.4 | UI Library |
| React Router | 7.13.2 | Client-side routing |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4.2.2 | Styling |
| Vite | 8.0.0 | Build tool |

## 📁 Cấu Trúc Dự Án

```
frontend/
├── src/
│   ├── components/          # Tái sử dụng components
│   │   ├── layout/          # Header, Sidebar, MainLayout
│   │   ├── common/          # Button, Input, Modal...
│   │   ├── recipe/          # RecipeCard, RecipeGrid...
│   │   └── auth/            # Auth form components
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── store/               # State management (Context)
│   ├── router/              # React Router config
│   ├── types/               # TypeScript types
│   ├── utils/               # Helpers & constants
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global CSS
├── public/                  # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── ARCHITECTURE.md          # Architecture guide
```

## 🚀 Bắt Đầu

### Prerequisites
- Node.js 18+ 
- npm hoặc yarn

### Installation

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
echo "VITE_API_URL=http://localhost:8080/api" > .env.local

# 4. Start development server
npm run dev
```

Ứng dụng sẽ mở tại `http://localhost:5173`

### Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run linter
npm run lint
```

## 📚 Project Structure Explanation

### Components (`src/components/`)

#### Layout Components
```tsx
import { MainLayout } from '@/components/layout';

// Usage
<MainLayout 
  isLoggedIn={true}
  userName="John Doe"
  onLogout={handleLogout}
>
  <YourContent />
</MainLayout>
```

#### Common Components
```tsx
import { 
  Button, 
  Input, 
  Modal, 
  Spinner, 
  NavLink 
} from '@/components/common';

// Usage
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

### Pages (`src/pages/`)

Các trang chính của ứng dụng:

| Page | Route | Description |
|------|-------|-------------|
| LoginPage | `/login` | Đăng nhập |
| RegisterPage | `/register` | Đăng ký |
| RecipeExplorerPage | `/recipes` | Khám phá công thức |
| RecipeDetailPage | `/recipes/:id` | Chi tiết công thức |
| ShoppingListPage | `/shopping-list` | Danh sách mua |
| UserProfilePage | `/profile` | Hồ sơ người dùng |
| WeeklyMealPlannerPage | `/meal-planner` | Lên kế hoạch bữa |

### Services (`src/services/`)

```tsx
import { recipeService, authService } from '@/services';

// Recipe API
const recipes = await recipeService.getAll(page, limit);
const recipe = await recipeService.getById(id);
const results = await recipeService.search(query);

// Auth API
await authService.login(email, password);
await authService.register(email, password, username);
await authService.logout();
```

### Hooks (`src/hooks/`)

```tsx
import { useAuth, useFetch, useLocalStorage } from '@/hooks';

// Auth hook
const { isLoggedIn, user, login, logout } = useAuth();

// Fetch hook
const { data, loading, error } = useFetch('/api/recipes');

// Local storage hook
const [value, setValue] = useLocalStorage('key', 'default');
```

### Store (`src/store/`)

State management với Context API:

```tsx
import { AuthProvider, useAuthStore } from '@/store';

// Provider
<AuthProvider>
  <App />
</AuthProvider>

// Hook
function MyComponent() {
  const { user, isLoggedIn, logout } = useAuthStore();
  return (/* ... */);
}
```

### Utils (`src/utils/`)

```tsx
import { 
  formatTime, 
  formatDate,
  isValidEmail,
  ROUTES,
  RECIPE_CATEGORIES
} from '@/utils';

// Formatters
formatTime(90)           // "1h 30m"
formatDate(new Date())   // "28 Tháng 3, 2026"

// Validators
isValidEmail('test@example.com') // true

// Constants
ROUTES.HOME              // "/"
RECIPE_CATEGORIES        // [...]
```

## 🎨 Styling with Tailwind CSS

### Class Examples

```tsx
// Spacing & Layout
className="p-4 m-2 gap-4 space-y-6"
className="flex items-center justify-between"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// Colors
className="bg-blue-600 text-white hover:bg-blue-700"

// Typography
className="text-xl font-bold text-gray-900"

// Responsive
className="px-4 sm:px-6 lg:px-8"

// Interactive
className="transition-colors hover:bg-gray-100 active:scale-95"
```

### Theme Colors
- Primary: Blue (`#3B82F6`)
- Secondary: Gray
- Success: Green
- Warning: Yellow
- Danger: Red

## 🔐 Authentication Flow

```tsx
// 1. User logs in
const { login } = useAuthStore();
await login('user@example.com', 'password123');

// 2. User info saved in store
const { user, isLoggedIn } = useAuthStore();

// 3. Protected content renders based on auth state
{isLoggedIn ? <PrivateContent /> : <PublicContent />}

// 4. Logout
const { logout } = useAuthStore();
logout();
```

## 🔗 API Integration

### Base URL Configuration
```env
# .env.local
VITE_API_URL=http://localhost:8080/api
```

### API Endpoints

```
Authentication:
  POST   /auth/login
  POST   /auth/register
  POST   /auth/logout
  GET    /auth/me

Recipes:
  GET    /recipes
  GET    /recipes/:id
  POST   /recipes
  PUT    /recipes/:id
  DELETE /recipes/:id
  GET    /recipes/search?q=query

Shopping List:
  GET    /shopping-list
  POST   /shopping-list/items
  PUT    /shopping-list/items/:id
  DELETE /shopping-list/items/:id

Meal Plans:
  GET    /meal-plans
  POST   /meal-plans
  PUT    /meal-plans/:id
```

## 🧪 Development Tips

### 1. Add a New Page

```tsx
// src/pages/MyNewPage.tsx
import { MainLayout } from '@/components';

export const MyNewPage = () => {
  return (
    <MainLayout isLoggedIn={true} onLogout={() => {}}>
      <div>My Content</div>
    </MainLayout>
  );
};
```

### 2. Add a New Route

```tsx
// src/router/routes.tsx
{
  path: '/my-new-page',
  element: <MyNewPage />,
}
```

### 3. Use API Service

```tsx
import { recipeService } from '@/services';
import { useEffect, useState } from 'react';

export function MyComponent() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    recipeService.getAll().then(setRecipes);
  }, []);
  
  return (/* ... */);
}
```

### 4. Create Custom Component

```tsx
// src/components/recipe/MyComponent.tsx
interface MyComponentProps {
  title: string;
  description?: string;
}

export const MyComponent = ({ title, description }: MyComponentProps) => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};
```

## 📝 TypeScript Best Practices

- ✅ Luôn sử dụng explicit types
- ✅ Tránh `any` type
- ✅ Export interfaces từ `types/` folder
- ✅ Sử dụng `interface` cho React props
- ✅ Sử dụng `type` cho utility types

```tsx
// Good ✅
interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  // ...
};

// Avoid ❌
const RecipeCard = ({ recipe, onSelect }: any) => {
  // ...
};
```

## 🐛 Debugging

### Chrome DevTools
1. Mở `http://localhost:5173` trong Chrome
2. F12 để mở DevTools
3. React DevTools extension: https://react.dev/learn/react-developer-tools

### Console Logging
```tsx
console.log('Component state:', value);
console.error('API Error:', error);
console.table(data);
```

## 🚢 Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Output will be in dist/ folder
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**NguyenNguDang**

---

## 🎯 Next Steps

- [ ] Implement state management (Zustand)
- [ ] Add form validation (Zod/Yup)
- [ ] Set up unit testing (Vitest)
- [ ] Add error boundary
- [ ] Implement dark mode
- [ ] Add PWA support
- [ ] Performance optimization
- [ ] SEO optimization

---

**Last Updated**: March 28, 2026
