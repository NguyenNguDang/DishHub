import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserRecipes, useDeleteRecipe} from '../hooks';


interface Filters {
  search: string;
  difficulty: string;
  sortBy: 'newest' | 'oldest' | 'rating' | 'prepTime';
}

const MyRecipesPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    difficulty: 'All',
    sortBy: 'newest',
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Mutations
  const deleteRecipeMutation = useDeleteRecipe();

  // Fetch user recipes from API
  const { data: userRecipes = [], isLoading, error } = useGetUserRecipes('me', 0, 100);

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipeMutation.mutateAsync(recipeId);
      setDeleteConfirm(null);
      console.log('Recipe deleted successfully');
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const diff = difficulty.toLowerCase();
    switch (diff) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  const filteredRecipes = userRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesDifficulty =
      filters.difficulty === 'All' || recipe.difficulty === filters.difficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'prepTime':
        return a.prepTime - b.prepTime;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to load recipes
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            My Recipes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your collection of delicious recipes
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/recipes/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create New Recipe
          </Link>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Export Recipes
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Recipes</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {userRecipes.length}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Public Recipes</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {userRecipes.filter((r) => r.isPublic).length}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {userRecipes.reduce((sum, r) => sum + r.reviews, 0)}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-orange-500">
              {userRecipes.length > 0 ? (
                (
                  userRecipes.reduce((sum, r) => sum + r.rating, 0) /
                  userRecipes.length
                ).toFixed(1)
              ) : (
                '0.0'
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as Filters['sortBy'],
                  })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
                <option value="prepTime">Shortest Prep Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-orange-500/10 transition-all relative"
              >
                {/* Delete Confirmation Modal */}
                {deleteConfirm === recipe.id && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-6 max-w-sm mx-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Delete Recipe?
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        This action cannot be undone. Are you sure you want to delete "{recipe.title}"?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={async () => await handleDeleteRecipe(recipe.id)}
                          disabled={deleteRecipeMutation.isPending}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleteRecipeMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          disabled={deleteRecipeMutation.isPending}
                          className="flex-1 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${recipe.image}")` }}
                  />
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm"
                      style={{
                        color: favorites.has(recipe.id) ? '#ef4444' : '#94a3b8',
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{
                          fill: favorites.has(recipe.id) ? '1' : '0',
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  {/* Public Badge */}
                  {recipe.isPublic && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm">
                        public
                      </span>
                      Public
                    </div>
                  )}
                  {!recipe.isPublic && (
                    <div className="absolute bottom-3 left-3 bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm">
                        lock
                      </span>
                      Private
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <div>
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-2"
                    >
                      {recipe.title}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Created: {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Difficulty Badge */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(
                        recipe.difficulty
                      )}`}
                    >
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                      {recipe.nutrition?.totalCalories || 0} kcal
                    </span>
                  </div>

                  {/* Info Bar */}
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      ⏱️ {recipe.prepTime + recipe.cookTime}m
                    </div>
                    <div className="flex items-center gap-1">
                      👥 {recipe.servings}
                    </div>
                    <div className="flex items-center gap-1">
                      ⭐ {recipe.rating} ({recipe.reviews})
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 py-2 px-3 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
                    >
                      View
                    </Link>
                    <Link
                      to={`/recipes/edit/${recipe.id}`}
                      className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(recipe.id)}
                      className="py-2 px-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mx-auto mb-4 block">
              kitchen
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start creating your own recipes or explore the community collection
            </p>
            <Link
              to="/recipes/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipesPage;

