import React, { useState } from 'react';
import { useAddRecipe } from '../../hooks/useRecipeApi';
import type { CreateRecipeRequest, Ingredient } from '../../types';

/**
 * Component form để thêm công thức mới
 * Sử dụng useAddRecipe hook để submit
 */
export const AddRecipeForm: React.FC = () => {
  const { mutate: addRecipe, isPending, error } = useAddRecipe();

  const [formData, setFormData] = useState<CreateRecipeRequest>({
    title: '',
    description: '',
    image: '',
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    difficulty: 'medium',
    category: 'lunch',
    tags: [],
    ingredients: [],
    instructions: [],
  });

  const [newTag, setNewTag] = useState<string>('');
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: '',
    name: '',
    quantity: 0,
    unit: 'g',
  });
  const [newInstruction, setNewInstruction] = useState<string>('');

  // Handle thay đổi input text/number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev: CreateRecipeRequest) => ({
      ...prev,
      [name]: name === 'cookTime' || name === 'prepTime' || name === 'servings' ? parseInt(value, 10) : value,
    }));
  };

  // Thêm tag
  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData((prev: CreateRecipeRequest) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  // Xóa tag
  const handleRemoveTag = (index: number) => {
    setFormData((prev: CreateRecipeRequest) => ({
      ...prev,
      tags: prev.tags.filter((_: string, i: number) => i !== index),
    }));
  };

  // Thêm nguyên liệu
  const handleAddIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.quantity > 0) {
      setFormData((prev: CreateRecipeRequest) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            ...newIngredient,
            id: Date.now().toString(),
          },
        ],
      }));
      setNewIngredient({
        id: '',
        name: '',
        quantity: 0,
        unit: 'g',
      });
    }
  };

  // Xóa nguyên liệu
  const handleRemoveIngredient = (index: number) => {
    setFormData((prev: CreateRecipeRequest) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_: Ingredient, i: number) => i !== index),
    }));
  };

  // Thêm hướng dẫn
  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setFormData((prev: CreateRecipeRequest) => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction.trim()],
      }));
      setNewInstruction('');
    }
  };

  // Xóa hướng dẫn
  const handleRemoveInstruction = (index: number) => {
    setFormData((prev: CreateRecipeRequest) => ({
      ...prev,
      instructions: prev.instructions.filter((_: string, i: number) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên công thức');
      return;
    }

    if (!formData.description.trim()) {
      alert('Vui lòng nhập mô tả');
      return;
    }

    if (formData.ingredients.length === 0) {
      alert('Vui lòng thêm ít nhất một nguyên liệu');
      return;
    }

    if (formData.instructions.length === 0) {
      alert('Vui lòng thêm ít nhất một hướng dẫn');
      return;
    }

    // Submit
    addRecipe(formData, {
      onSuccess: () => {
        alert('Thêm công thức thành công!');
        setFormData({
          title: '',
          description: '',
          image: '',
          cookTime: 30,
          prepTime: 15,
          servings: 4,
          difficulty: 'medium',
          category: 'lunch',
          tags: [],
          ingredients: [],
          instructions: [],
        });
      },
      onError: (err: Error) => {
        alert(`Lỗi: ${err.message}`);
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Thêm Công Thức Mới</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Lỗi: {error instanceof Error ? error.message : 'Có lỗi xảy ra'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên công thức */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Công Thức *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nhập tên công thức"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả chi tiết"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL Hình Ảnh</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Nhập URL hình ảnh"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        {/* Thông tin thời gian */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thời Gian Chuẩn Bị (phút)</label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thời Gian Nấu (phút)</label>
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Khẩu Phần (người)</label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Loại & Độ khó */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Danh Mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value="breakfast">Bữa sáng</option>
              <option value="lunch">Bữa trưa</option>
              <option value="dinner">Bữa tối</option>
              <option value="snack">Xế chiều</option>
              <option value="dessert">Tráng miệng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Độ Khó</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Nhập tag và nhấn Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              disabled={isPending}
            >
              Thêm
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nguyên liệu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nguyên Liệu *</label>
          <div className="space-y-2 mb-4">
            {formData.ingredients.map((ingredient: Ingredient, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-800">
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  disabled={isPending}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tên nguyên liệu"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Số lượng"
                value={newIngredient.quantity || ''}
                onChange={(e) =>
                  setNewIngredient((prev) => ({
                    ...prev,
                    quantity: parseFloat(e.target.value) || 0,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
              <select
                value={newIngredient.unit}
                onChange={(e) =>
                  setNewIngredient((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              >
                <option value="g">Gram (g)</option>
                <option value="ml">Ml (ml)</option>
                <option value="cup">Cốc (cup)</option>
                <option value="tbsp">Muỗng canh (tbsp)</option>
                <option value="tsp">Muỗng cà phê (tsp)</option>
                <option value="piece">Cái (piece)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              disabled={isPending}
            >
              Thêm Nguyên Liệu
            </button>
          </div>
        </div>

        {/* Hướng dẫn nấu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hướng Dẫn Nấu *</label>
          <div className="space-y-2 mb-4">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-800">{instruction}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  disabled={isPending}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <textarea
              placeholder="Nhập hướng dẫn nấu ăn"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleAddInstruction();
                }
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={handleAddInstruction}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              disabled={isPending}
            >
              Thêm Hướng Dẫn (Ctrl+Enter)
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {isPending ? 'Đang thêm...' : 'Thêm Công Thức'}
          </button>
          <button
            type="reset"
            disabled={isPending}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
          >
            Xóa Form
          </button>
        </div>
      </form>
    </div>
  );
};

