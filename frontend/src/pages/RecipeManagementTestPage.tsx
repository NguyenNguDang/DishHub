import React, { useState } from 'react';
import { RecipeListComponent } from '../components/recipe/RecipeListComponent';
import { AddRecipeForm } from '../components/recipe/AddRecipeForm';

/**
 * Page test để hiển thị danh sách công thức và form thêm công thức
 * Sử dụng RecipeListComponent và AddRecipeForm
 */
export const RecipeManagementTestPage: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Quản Lý Công Thức</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các công thức nấu ăn của bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Button để toggle form */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {showForm ? '✕ Đóng Form' : '➕ Thêm Công Thức Mới'}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-12 animate-fadeIn">
            <AddRecipeForm />
          </div>
        )}

        {/* List Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <RecipeListComponent />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 DishHub - Nền tảng chia sẻ công thức nấu ăn | Built with React + TypeScript + React Query
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

