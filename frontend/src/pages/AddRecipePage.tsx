import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddRecipe } from '../hooks';
import type { CreateRecipeRequest } from '../types';

export const AddRecipePage = () => {
  const navigate = useNavigate();
  const addRecipe = useAddRecipe();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateRecipeRequest>({
    title: '',
    description: '',
    image: '',
    servings: 2,
    prepTime: 0,
    cookTime: 0,
    difficulty: 'medium',
    category: '',
    tags: [],
    ingredients: [],
    instructions: [],
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        setError('Vui lòng nhập tên công thức');
        setIsLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError('Vui lòng nhập mô tả công thức');
        setIsLoading(false);
        return;
      }

      console.log('Tạo công thức:', formData);
      await addRecipe.mutateAsync(formData);
      
      setSuccessMessage('Công thức được tạo thành công!');
      setTimeout(() => {
        navigate('/my-recipes', { replace: true });
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tạo công thức';
      setError(` Lỗi: ${errorMessage}`);
      console.error('Lỗi tạo công thức:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Tạo công thức mới
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Chia sẻ công thức yêu thích của bạn với cộng đồng
        </p>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Tên công thức *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              placeholder="Ví dụ: Phở Bò Hà Nội"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Mô tả *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              placeholder="Mô tả công thức chi tiết..."
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              URL Ảnh công thức
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              placeholder="https://example.com/recipe.jpg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Thời gian chuẩn bị (phút) *
              </label>
              <input
                type="number"
                required
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prepTime: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Thời gian nấu (phút) *
              </label>
              <input
                type="number"
                required
                value={formData.cookTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cookTime: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                min="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Số người ăn *
              </label>
              <input
                type="number"
                required
                value={formData.servings}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servings: parseInt(e.target.value) || 1,
                  })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Độ khó *
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                  })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Danh mục *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                placeholder="Ví dụ: Món chính, Cơm, Súp..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                placeholder="Ví dụ: nhanh, dễ, dân dã"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || addRecipe.isPending}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading || addRecipe.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Đang tạo...
                </>
              ) : (
                'Tạo công thức'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading || addRecipe.isPending}
              className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Hủy
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>Mẹo:</strong> Điền đầy đủ thông tin công thức và nhấn "Tạo công thức" để thêm vào hệ thống. Sau khi tạo thành công, bạn sẽ được chuyển đến trang danh sách công thức của mình.
          </p>
        </div>
      </div>
    </div>
  );
};
