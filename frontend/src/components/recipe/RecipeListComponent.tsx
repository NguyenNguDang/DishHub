import React, { useState } from 'react';
import { useGetRecipes, useDeleteRecipe } from '../../hooks/useRecipeApi';
import type { Recipe, Ingredient } from '../../types';

/**
 * Component hiển thị danh sách công thức
 * Sử dụng useGetRecipes hook để fetch dữ liệu
 */
export const RecipeListComponent: React.FC = () => {
  const { data: recipes, isLoading, error } = useGetRecipes();
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Đang tải công thức...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Lỗi: Không thể tải công thức</p>
        <p className="text-red-600 mt-2">{error instanceof Error ? error.message : 'Lỗi không xác định'}</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">Không có công thức nào. Hãy tạo một công thức mới!</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      deleteRecipe(id, {
        onSuccess: () => {
          setSelectedRecipeId(null);
          alert('Xóa công thức thành công!');
        },
        onError: (error: Error) => {
          alert(`Lỗi: ${error.message}`);
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Danh Sách Công Thức ({recipes.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe: Recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Hình ảnh */}
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Nội dung */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{recipe.title}</h3>

              <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>

              {/* Thông tin công thức */}
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Loại:</span> {recipe.category}
                </div>
                <div>
                  <span className="font-medium">Độ khó:</span>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${
                      recipe.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : recipe.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {recipe.difficulty === 'easy'
                      ? 'Dễ'
                      : recipe.difficulty === 'medium'
                        ? 'Trung bình'
                        : 'Khó'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Thời gian:</span> {recipe.prepTime + recipe.cookTime} phút
                </div>
                <div>
                  <span className="font-medium">Phục vụ:</span> {recipe.servings} người
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-700">
                  {recipe.rating.toFixed(1)} ({recipe.reviews} đánh giá)
                </span>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      +{recipe.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedRecipeId && (
        <RecipeDetailModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
          recipes={recipes}
        />
      )}
    </div>
  );
};

/**
 * Modal hiển thị chi tiết công thức
 */
interface RecipeDetailModalProps {
  recipeId: string;
  onClose: () => void;
  recipes: Recipe[];
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipeId, onClose, recipes }) => {
  const recipe = recipes.find((r: Recipe) => r.id === recipeId);

  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hình ảnh */}
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          {/* Mô tả */}
          <p className="text-gray-700">{recipe.description}</p>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 font-medium">Loại</p>
              <p className="text-lg text-gray-800">{recipe.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Độ khó</p>
              <p className="text-lg text-gray-800">
                {recipe.difficulty === 'easy'
                  ? 'Dễ'
                  : recipe.difficulty === 'medium'
                    ? 'Trung bình'
                    : 'Khó'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Thời gian chuẩn bị</p>
              <p className="text-lg text-gray-800">{recipe.prepTime} phút</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Thời gian nấu</p>
              <p className="text-lg text-gray-800">{recipe.cookTime} phút</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Khẩu phần</p>
              <p className="text-lg text-gray-800">{recipe.servings} người</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Đánh giá</p>
              <p className="text-lg text-gray-800">
                ⭐ {recipe.rating.toFixed(1)} ({recipe.reviews})
              </p>
            </div>
          </div>

          {/* Nguyên liệu */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nguyên Liệu</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: Ingredient) => (
                  <li key={ingredient.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-800">{ingredient.name}</span>
                    <span className="text-gray-600 font-medium">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hướng dẫn nấu */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hướng Dẫn Nấu</h3>
              <ol className="space-y-2">
                {recipe.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag: string) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>Tạo bởi: {recipe.createdBy}</p>
            <p>Tạo lúc: {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
