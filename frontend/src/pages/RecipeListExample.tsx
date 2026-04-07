import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFetchRecipes } from '../hooks/useServerState';
import type { Recipe } from '../types';

/**
 * Ví dụ component sử dụng Zustand (Client State) + React Query (Server State)
 */
export const RecipeListExample: React.FC = () => {
  // Client State - từ Zustand
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore();

  // Server State - từ React Query
  const { data: recipes, isLoading, error } = useFetchRecipes();

  if (isLoading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error.message}</div>;

  // Filter recipes based on client state
  const filteredRecipes: Recipe[] = (recipes ?? []).filter((recipe: Recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Công Thức Nấu Ăn</h1>

      {/* Filter Section - Client State */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm công thức..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả danh mục</option>
          <option value="breakfast">Bữa sáng</option>
          <option value="lunch">Bữa trưa</option>
          <option value="dinner">Bữa tối</option>
        </select>
      </div>

      {/* Recipes Grid - Server State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-3">{recipe.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600 font-medium">{recipe.category}</span>
              <span className="text-sm text-gray-500">{recipe.prepTime} phút</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-600">{recipe.rating} ({recipe.reviews} đánh giá)</span>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center text-gray-500 py-12">Không tìm thấy công thức nào</div>
      )}
    </div>
  );
};

