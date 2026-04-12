import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services';

interface Filters {
  search: string;
  ingredients: string;
  maxCalories: number;
  category: string;
}

const RecipeExplorerPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    ingredients: '',
    maxCalories: 1500,
    category: 'All',
  });

  // State riêng cho query (dùng để debounce)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ['All', 'Breakfast', 'Vegan', 'Quick & Easy', 'Gluten-Free', 'Desserts'];

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  /**
   * Fetch recipes dựa trên filters
   * useQuery sẽ tự động refetch khi dependencies thay đổi
   */
  const { data: recipes = [], isLoading, error } = useQuery({
    queryKey: ['recipes', debouncedSearch, filters.category],
    queryFn: async () => {
      try {
        if (debouncedSearch) {
          console.log('🔍 Calling search API:', debouncedSearch);
          return await recipeService.search(debouncedSearch);
        } else if (filters.category !== 'All') {
          console.log('📂 Fetching by category:', filters.category);
          return await recipeService.getByCategory(filters.category);
        } else {
          console.log('📋 Fetching all recipes');
          return await recipeService.getAll();
        }
      } catch (error) {
        console.error('❌ Error in queryFn:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collect 10 phút
  });

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.search.trim()) {
      // Clear search
      setDebouncedSearch('');
      return;
    }
    // Debounce sẽ tự động trigger refetch
    // Không cần gọi thêm cái gì vì useEffect đã handle rồi
  };

  // Handle category change
  const handleCategoryClick = (category: string) => {
    setFilters({ ...filters, category, search: '' });
    setDebouncedSearch(''); // Reset search khi chọn category
    // useQuery sẽ tự động refetch vì category thay đổi
  };

  // Map error object hoặc message
  const errorMessage = error instanceof Error
    ? error.message
    : 'Failed to load recipes. Please try again.';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
            <div className="animate-spin">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                refresh
              </span>
            </div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Loading recipes...
            </p>
          </div>
        )}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Discover your next meal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Explore delicious recipes from talented chefs</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e as any);
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <button
            style={{ backgroundColor: '#f27f0d' }}
            className="px-6 py-3 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            onClick={handleSearchSubmit}
            disabled={isLoading}
            title="Search recipes"
          >
            Search
          </button>
        </div>

        {/* Smart Suggestion Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Smart Suggestion
          </label>
          <input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, tomato)"
            value={filters.ingredients}
            onChange={(e) => setFilters({ ...filters, ingredients: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Max Calories Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Max Calories</label>
            <span className="text-sm font-bold text-orange-500">{filters.maxCalories} kcal</span>
          </div>
          <input
            type="range"
            min="100"
            max="1500"
            value={filters.maxCalories}
            onChange={(e) => setFilters({ ...filters, maxCalories: parseInt(e.target.value) })}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>100</span>
            <span>1500</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Category</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  filters.category === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Empty State */}
          {recipes.length === 0 && !isLoading && !error && (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 flex justify-center mb-4">
                restaurant
              </span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No recipes found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Error State - No recipes loaded */}
          {recipes.length === 0 && error && (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-6xl text-red-300 dark:text-red-600 flex justify-center mb-4">
                error_outline
              </span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Unable to load recipes at this time.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && recipes.length === 0 && (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Recipe Cards */}
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-orange-500/10 transition-all no-underline"
            >
              {/* Recipe Image */}
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
                    style={{ color: favorites.has(recipe.id) ? '#ef4444' : '#94a3b8' }}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fill: favorites.has(recipe.id) ? '1' : '0' }}>
                      favorite
                    </span>
                  </button>
                </div>
                {/* Star Rating */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-orange-500 text-sm" style={{ fill: '1' }}>
                    star
                  </span>
                  <span className="text-xs font-bold text-slate-900">{recipe.rating}</span>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-orange-500 transition-colors dark:text-white">
                    {recipe.title}
                  </h3>
                  <span className="text-orange-500 font-bold text-sm bg-orange-500/10 px-2 py-0.5 rounded">
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                </div>
                {/* Recipe Details */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-orange-500">star</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{recipe.rating} • {recipe.reviews} reviews</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {recipes.length > 0 && !isLoading && (
          <div className="flex justify-center py-8">
            <button
              style={{ borderColor: '#f27f0d', color: '#f27f0d' }}
              className="flex items-center gap-2 px-8 py-3 rounded-full border-2 font-bold transition-all hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#f27f0d';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#f27f0d';
              }}
            >
              Load More Recipes
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-6 lg:px-40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-orange-500">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="font-bold dark:text-white">DishHub</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400">
            <a className="hover:text-orange-500" href="#">About</a>
            <a className="hover:text-orange-500" href="#">Privacy</a>
            <a className="hover:text-orange-500" href="#">Terms</a>
            <a className="hover:text-orange-500" href="#">Help Center</a>
          </div>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-orange-500">
              <span className="material-symbols-outlined text-lg">public</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-orange-500">
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-slate-400">
          © 2024 DishHub Inc. All rights reserved.
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecipeExplorerPage;
