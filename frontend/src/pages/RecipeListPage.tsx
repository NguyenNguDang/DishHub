/**
 * RecipeListPage.tsx
 * Trang danh sách công thức - sử dụng <Link> để chuyển trang
 */

import { Link } from 'react-router-dom';
import type { Recipe } from '../types';

export const RecipeListPage = () => {
  // Mock data - thay bằng gọi API thực tế
  const recipes: Recipe[] = [
    {
      id: '1',
      title: 'Phở Bò Hà Nội',
      description: 'Phở bò truyền thống Hà Nội với nước dùng thơm ngon',
      image: 'https://via.placeholder.com/300x200',
      servings: 4,
      prepTime: 30,
      cookTime: 120,
      difficulty: 'medium',
      ingredients: [],
      instructions: [],
    },
    {
      id: '2',
      title: 'Gỏi Cuốn Tôm',
      description: 'Gỏi cuốn tôm tươi với bánh tráng nướng',
      image: 'https://via.placeholder.com/300x200',
      servings: 2,
      prepTime: 20,
      cookTime: 0,
      difficulty: 'easy',
      ingredients: [],
      instructions: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Danh sách công thức</h1>
          <Link
            to={routes.recipeNew}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            + Thêm công thức
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>⏱️ {recipe.prepTime + recipe.cookTime} phút</span>
                  <span>👥 {recipe.servings} người</span>
                </div>
                {/* 
                  Sử dụng <Link> cho điều hướng khai báo trên UI
                  route.recipeDetail(recipe.id) tạo URL type-safe: /recipes/1
                */}
                <Link
                  to={routes.recipeDetail(recipe.id)}
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
