/**
 * RecipeDetailExample.tsx
 * Example file - cách sử dụng route params với type-safety
 */

import { useRouteParams } from '@/hooks/useRouteParams';
import { routes, type RecipeDetailParams } from '@/router/AppRoutes';
import { useNavigate } from 'react-router-dom';

/**
 * Ví dụ 1: Lấy route params type-safe
 * 
 * URL: /recipes/123
 * const { id } = useRouteParams<RecipeDetailParams>();
 * id có type: string
 */
export const RecipeDetailExample = () => {
  const navigate = useNavigate();
  
  // ✅ Type-safe way: id được inferred có type string
  const { id } = useRouteParams<RecipeDetailParams>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Chi tiết công thức</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-4">
          ID công thức từ URL: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
        </p>

        <button
          onClick={() => navigate(routes.recipes)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Quay lại danh sách
        </button>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">💡 Type-Safety Examples:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
{`// ✅ ĐÚNG - type-safe
const { id } = useRouteParams<RecipeDetailParams>();

// ❌ SAI - không type-safe
const { id } = useParams();

// ✅ Navigate với type-safe URL
navigate(routes.recipeDetail("123"));

// ❌ SAI - dễ sai lỗi
navigate("/recipes/" + id);
`}
        </pre>
      </div>
    </div>
  );
};
