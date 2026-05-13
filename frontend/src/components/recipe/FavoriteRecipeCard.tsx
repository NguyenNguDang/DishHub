import { Link } from 'react-router-dom';
import type { Recipe } from '../../types';
import { useRemoveFavorite } from '../../hooks/useFavoritesApi';

interface FavoriteRecipeCardProps {
    recipe: Recipe;
    onRemove?: () => void;
}

export const FavoriteRecipeCard = ({ recipe, onRemove }: FavoriteRecipeCardProps) => {
    const removeFavoriteMutation = useRemoveFavorite();

    const handleRemove = async () => {
        try {
            await removeFavoriteMutation.mutateAsync(recipe.id);
            onRemove?.();
        } catch (err) {
            console.error('Failed to remove favorite:', err);
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <div
                    className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url("${recipe.image}")` }}
                />
                {/* Remove Button */}
                <button
                    onClick={handleRemove}
                    disabled={removeFavoriteMutation.isPending}
                    className="absolute top-3 right-3 size-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <Link to={`/recipes/${recipe.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-2">
                        {recipe.title}
                    </h3>
                </Link>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {recipe.description}
                </p>

                {/* Meta */}
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div>⏱️ {recipe.prepTime + recipe.cookTime}m</div>
                    <div>⭐ {recipe.rating}</div>
                </div>

                {/* Action */}
                <Link
                    to={`/recipes/${recipe.id}`}
                    className="block w-full py-2 px-3 bg-orange-500 text-white text-sm font-bold text-center rounded-lg hover:bg-orange-600 transition-colors"
                >
                    View Recipe
                </Link>
            </div>
        </div>
    );
};