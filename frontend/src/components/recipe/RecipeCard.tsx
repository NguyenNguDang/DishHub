import { Link } from 'react-router-dom';
import type { Recipe } from '../../types';
import { formatTime } from '../../utils/formatters';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-sm font-medium">
            ⭐ {recipe.rating}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {recipe.description}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {recipe.category}
            </span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {recipe.difficulty}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
            <div className="flex gap-4">
              <span>⏱️ {formatTime(recipe.cookTime)}</span>
              <span>🍽️ {recipe.servings} phần</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
