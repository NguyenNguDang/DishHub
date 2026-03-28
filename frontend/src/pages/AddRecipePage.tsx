/**
 * AddRecipePage.tsx
 * Trang thêm công thức - sử dụng useNavigate() để chuyển trang sau submit
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Recipe types không dùng

export const AddRecipePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 2,
    prepTime: 0,
    cookTime: 0,
    difficulty: 'medium' as const,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Giả lập gọi API thêm công thức
      console.log('Thêm công thức:', formData);

      // Sau khi submit thành công, điều hướng về trang danh sách
      // Sử dụng useNavigate hook (dispatch, không phải khai báo)
      navigate(routes.recipes, { replace: true });

      // Hoặc với message: navigate(routes.recipes, { state: { message: 'Thêm thành công!' } })
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Thêm công thức mới</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên công thức *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ví dụ: Phở Bò Hà Nội"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mô tả *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Mô tả công thức..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Thời gian chuẩn bị (phút)
              </label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prepTime: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Thời gian nấu (phút)
              </label>
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cookTime: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Số người ăn
              </label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servings: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Độ khó
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Thêm công thức
            </button>
            {/* 
              Nút Hủy sử dụng useNavigate để quay lại
              navigate(-1) quay lại trang trước
            */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Mẹo:</strong> Sau khi thêm công thức thành công, bạn sẽ
            được chuyển về trang danh sách bằng <code>useNavigate()</code>
          </p>
        </div>
      </div>
    </div>
  );
};
