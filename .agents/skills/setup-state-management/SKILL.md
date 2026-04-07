---
name: setup-react-state-management
description: Hướng dẫn cài đặt và cấu hình Zustand cho Client State và React Query (TanStack Query) cho Server State trong dự án React. Kích hoạt khi cần thiết lập hệ thống quản lý state cho frontend.
---

# Setup Zustand & React Query

## 1. Cài đặt thư viện
```bash
npm install zustand @tanstack/react-query
```
## 2. Cấu hình React Query (Server State)
Bọc component gốc (VD: main.tsx hoặc App.tsx) bằng QueryClientProvider:

TypeScript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
## 3. Khởi tạo Zustand Store (Client State)
Tạo file store (VD: src/stores/useAppStore.ts):

TypeScript
import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
## 4. Tích hợp vào Component
TypeScript
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../stores/useAppStore';

export const MyComponent = () => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  const { data, isLoading } = useQuery({
    queryKey: ['fetch-data'],
    queryFn: async () => {
      const res = await fetch('/api/data');
      return res.json();
    }
  });

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div>
      <button onClick={toggleSidebar}>Sidebar: {isSidebarOpen ? 'Mở' : 'Đóng'}</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};