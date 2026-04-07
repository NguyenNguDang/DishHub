import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface UserRecipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  image: string;
  rating: number;
  reviews: number;
  createdDate: string;
  isFavorite: boolean;
  isPublic: boolean;
}

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

  // Mock data for user recipes
  const mockUserRecipes: UserRecipe[] = [
    {
      id: '1',
      title: 'Homemade Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, basil, and homemade dough',
      prepTime: 20,
      cookTime: 15,
      servings: 2,
      difficulty: 'Medium',
      calories: 280,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEXah1rF-QTmLAzoy6GV8bvRwtU1K0eyWYFqra0Sx0DQXozNWbsYEAA856FsgkqCbJ1EqaEWPWDeGJ_VPYJdoiHq2gaHX43yL2biBst7UZU-SSS33zhBPh_M7MLiGzfvzDnOdATkqWRujNTZz-nG3LddYML5kM2nGGc6bazOPH9qP5ILS-hwZMBPghpOaSnOvYpaRky3uC6-uaXS0cAt7--oR5BH8sTA6gNTsgYXsvzcNOsQmF2mFd8w1Eax4n8xtc6hTqFuDBlS1YZ',
      rating: 4.8,
      reviews: 24,
      createdDate: '2024-01-15',
      isFavorite: true,
      isPublic: true,
    },
    {
      id: '2',
      title: 'Spicy Thai Green Curry',
      description: 'Creamy coconut curry with chicken, vegetables, and aromatic Thai spices',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'Hard',
      calories: 320,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-CghtB1y1E_dWOWoQ9I6xPEnbCg0iRii97DYSN-PUZhpQ4czT2-Z_nasBdjDOtfvlXyg809vbNAeMIM9EIBGve7drI9XlT3mHYME0kMRlhQ2iEUq4jBAjWj_38RFcxBV5F8f1NKkP_7ftCTUIwTtOnrlyn30KU6ZgL-juKVMKyVadVR78NNMcUvzZRkG3pmx2koQ1FWXq8j_qZ0WCM2enZ2OBZS2Xw7jA3LkzFR8_5TCZijxOnbmpB9AuYpxIwgvS7o_K9tBXNodr',
      rating: 4.9,
      reviews: 31,
      createdDate: '2024-02-03',
      isFavorite: true,
      isPublic: true,
    },
    {
      id: '3',
      title: 'Quick Weeknight Pasta',
      description: 'Simple and delicious pasta with garlic, olive oil, and fresh parmesan',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: 'Easy',
      calories: 380,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUrgROEdXXH8bd9n2aCsdIIOTrQxMg2j4AcnihxKVzEnUrb1A3b4vHE8i_bI2CGxx4qCezc8VqeBNVmygHalRu2mtATCY4Pymb-N6uoe-nGGmH7i1XoCWBu9eoFSgIdWBzikZrZxjw_D4g4j80JNHV45bhkvUUgiAc_9J59Z1Ks9nqMZkLRr8viUDyFNO2hhdtPHhR52WbyhazddnF7iItwAiaiU52ELUUUbUfhpRRkNS9Df7NEibnQXUWKeSZAZDxyGQIv8L3HsAe',
      rating: 4.5,
      reviews: 15,
      createdDate: '2024-02-10',
      isFavorite: false,
      isPublic: true,
    },
    {
      id: '4',
      title: 'Chocolate Lava Cake',
      description: 'Decadent warm chocolate cake with molten center, perfect for dessert',
      prepTime: 10,
      cookTime: 12,
      servings: 2,
      difficulty: 'Medium',
      calories: 420,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsE-HMmf4P6K02QHdb4irWhfdKEfhf2hSQf9vnDvTbUsgLHTV38XdoDRpBuRy0bPwuB7iN1lLreUmdx_aySlgBAvE4UCYpjyrm5CoQVtMA0kuk7qJOJzvVzXBVcMzj6AZgyIfZo2UBPlNiBEbIsubu2ZoSrRfuqN0LJa3F6Cn_g_lHXWkMN2xoNWZy4m7ODvnMvpJ1TPPAFT0o6I8HQJ3mw_AS9A8OURdqYtPc1mqjnlwcT8sQBZ-f3z5tQSutroX4s6X9nkNrgILq',
      rating: 4.9,
      reviews: 42,
      createdDate: '2024-01-20',
      isFavorite: true,
      isPublic: false,
    },
    {
      id: '5',
      title: 'Grilled Salmon with Herbs',
      description: 'Fresh salmon fillet grilled with lemon, dill, and seasonal vegetables',
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: 'Easy',
      calories: 320,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUrgROEdXXH8bd9n2aCsdIIOTrQxMg2j4AcnihxKVzEnUrb1A3b4vHE8i_bI2CGxx4qCezc8VqeBNVmygHalRu2mtATCY4Pymb-N6uoe-nGGmH7i1XoCWBu9eoFSgIdWBzikZrZxjw_D4g4j80JNHV45bhkvUUgiAc_9J59Z1Ks9nqMZkLRr8viUDyFNO2hhdtPHhR52WbyhazddnF7iItwAiaiU52ELUUUbUfhpRRkNS9Df7NEibnQXUWKeSZAZDxyGQIv8L3HsAe',
      rating: 4.7,
      reviews: 18,
      createdDate: '2024-02-05',
      isFavorite: false,
      isPublic: true,
    },
    {
      id: '6',
      title: 'Buddha Bowl with Quinoa',
      description: 'Nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing',
      prepTime: 15,
      cookTime: 25,
      servings: 1,
      difficulty: 'Easy',
      calories: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8e_NgLFd7sTSYQxA1eHVs-xPBzK5B0hhS0SMDO1N_ZD0CU2BBL77vHPM5yG8G2LOJzNvxjCfKwB_F7W9e9Nwe2fSQIFJLOFVjlnFqMqXkPt5V_wL1I0fHb8IDJZ0fZO_eQhXtWRFmX0q0qsKtPfJ73NXHOTkPdO3e-eVU5BZCMiyjlp4TYKYSdFjdHCJ2W-uM8EAJHVMQD-Eo6jrZY3K0g6xpM5QkN7lUYLHlUJELmGj0N1UoRIKG5jJ3xW-n6v5gCJgT6nRqOvPQ2Fc8QT3CQ_75pMwFQYYdPWARXUSL8TN_VngL8j9jLBvv0DvvOJz8LFiqCFQhOX',
      rating: 4.6,
      reviews: 22,
      createdDate: '2024-02-08',
      isFavorite: false,
      isPublic: true,
    },
  ];

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  const filteredRecipes = mockUserRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesDifficulty =
      filters.difficulty === 'All' || recipe.difficulty === filters.difficulty;
    return matchesSearch && matchesDifficulty;
  });

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
            <span className="material-symbols-outlined text-xl">add</span>
            Create New Recipe
          </Link>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-xl">download</span>
            Export Recipes
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Recipes</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {mockUserRecipes.length}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Public Recipes</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {mockUserRecipes.filter((r) => r.isPublic).length}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {mockUserRecipes.reduce((sum, r) => sum + r.reviews, 0)}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-orange-500">
              {(
                mockUserRecipes.reduce((sum, r) => sum + r.rating, 0) /
                mockUserRecipes.length
              ).toFixed(1)}
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
                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-orange-500/10 transition-all"
              >
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
                      Created: {new Date(recipe.createdDate).toLocaleDateString()}
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
                      {recipe.difficulty}
                    </span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                      {recipe.calories} kcal
                    </span>
                  </div>

                  {/* Info Bar */}
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        schedule
                      </span>
                      {recipe.prepTime + recipe.cookTime}m
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        people
                      </span>
                      {recipe.servings}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      {recipe.rating} ({recipe.reviews})
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 py-2 px-3 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>
                      View
                    </Link>
                    <button className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                      Edit
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

