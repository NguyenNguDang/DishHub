import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetFavorites } from '../hooks/useFavoritesApi';
import { FavoriteRecipeCard } from '../components/recipe/FavoriteRecipeCard';

interface FavoritesFilter {
    search: string;
    sortBy: 'newest' | 'oldest' | 'title' | 'rating';
}

const FavoritesPage: React.FC = () => {
    const [filters, setFilters] = useState<FavoritesFilter>({
        search: '',
        sortBy: 'newest',
    });

    // Fetch favorites
    const { data: favorites = [], isLoading, error } = useGetFavorites('me', 0, 100);

    const filteredFavorites = favorites
        .filter((recipe) =>
            recipe.title.toLowerCase().includes(filters.search.toLowerCase())
        )
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'rating':
                    return b.rating - a.rating;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading favorites...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Failed to load favorites
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                        My Favorites
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Collection of {favorites.length} recipes you love
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Search
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                                <input
                                    type="text"
                                    placeholder="Search favorites..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) =>
                                    setFilters({ ...filters, sortBy: e.target.value as FavoritesFilter['sortBy'] })
                                }
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="rating">Highest Rating</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {filteredFavorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFavorites.map((recipe) => (
                            <FavoriteRecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mx-auto mb-4 block">
              favorite
            </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            No favorites yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Start adding recipes to your favorites collection
                        </p>
                        <Link
                            to="/recipes"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">explore</span>
                            Explore Recipes
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;