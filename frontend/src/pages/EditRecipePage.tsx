import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRecipeById, useUpdateRecipe, useUploadRecipeImage } from '../hooks';
import type { UpdateRecipeRequest } from '../types';

export const EditRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: recipe, isLoading: isLoadingRecipe } = useGetRecipeById(id || '');
  const updateRecipeMutation = useUpdateRecipe();
  const uploadRecipeImage = useUploadRecipeImage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<UpdateRecipeRequest>({
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

  // Populate form when recipe data is loaded
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        servings: recipe.servings,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        category: recipe.category,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });
      setImagePreview(recipe.image);
    }
  }, [recipe]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!formData.title?.trim()) {
        setError('Vui lòng nhập tên công thức');
        setIsLoading(false);
        return;
      }
      if (!formData.description?.trim()) {
        setError('Vui lòng nhập mô tả công thức');
        setIsLoading(false);
        return;
      }

      if (!id) {
        setError('Recipe ID không tìm thấy');
        setIsLoading(false);
        return;
      }

      let imageUrl = formData.image;

      // Handle image upload if a new file is selected
      if (imageFile) {
        const uploadResponse = await uploadRecipeImage.mutateAsync(imageFile);
        imageUrl = uploadResponse || formData.image;
      }
      
      console.log('Cập nhật công thức:', { ...formData, image: imageUrl });
      await updateRecipeMutation.mutateAsync({
        id,
        data: { ...formData, image: imageUrl },
      });
      
      setSuccessMessage('Công thức được cập nhật thành công!');
      setTimeout(() => {
        navigate('/my-recipes', { replace: true });
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể cập nhật công thức';
      setError(`Lỗi: ${errorMessage}`);
      console.error('Lỗi cập nhật công thức:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Preview the image file before uploading
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  if (isLoadingRecipe) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Recipe not found
          </p>
          <button
            onClick={() => navigate('/my-recipes')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Back to My Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Chỉnh sửa công thức
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Cập nhật thông tin công thức của bạn
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
              value={formData.title || ''}
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
              value={formData.description || ''}
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
              value={formData.image || ''}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              placeholder="https://example.com/recipe.jpg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Tải lên ảnh công thức
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Thời gian chuẩn bị (phút) *
              </label>
              <input
                type="number"
                required
                value={formData.prepTime || 0}
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
                value={formData.cookTime || 0}
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
                value={formData.servings || 1}
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
                value={formData.difficulty || 'medium'}
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
                value={formData.category || ''}
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
                value={(formData.tags || []).join(', ')}
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
              disabled={isLoading || updateRecipeMutation.isPending}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading || updateRecipeMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật công thức'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading || updateRecipeMutation.isPending}
              className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>Mẹo:</strong> Sửa đổi thông tin công thức và nhấn "Cập nhật công thức" để lưu các thay đổi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage;

