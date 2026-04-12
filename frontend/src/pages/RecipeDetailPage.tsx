import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService, type Review, type ReviewRequest } from '../services';
import type { Recipe } from '../types';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Fetch recipe detail
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) throw new Error('Recipe ID not found');
      console.log('📥 Fetching recipe:', id);
      return await recipeService.getById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) throw new Error('Recipe ID not found');
      console.log('📥 Fetching reviews for recipe:', id);
      return await recipeService.getRecipeReviews(id);
    },
    enabled: !!id,
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: ReviewRequest) => {
      if (!id) throw new Error('Recipe ID not found');
      return await recipeService.createReview(id, reviewData);
    },
    onSuccess: () => {
      // Refetch reviews
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setReviewText('');
      setReviewRating(5);
      alert('✅ Review submitted successfully!');
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      alert('❌ Failed to submit review. ' + (error instanceof Error ? error.message : ''));
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRating || (reviewRating < 1 || reviewRating > 5)) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    createReviewMutation.mutate({
      rating: reviewRating,
      comment: reviewText,
    });
  };

  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">Recipe not found</p>
          <Link to="/recipes" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
            ← Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin">
            <span className="material-symbols-outlined text-4xl text-orange-500">refresh</span>
          </div>
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <span className="material-symbols-outlined mb-4 flex justify-center text-6xl text-red-500">error</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">Failed to load recipe</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Link to="/recipes" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
            ← Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  const toggleIngredient = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const renderStars = (rating: number, size: string = 'text-lg') => {
    return (
      <div className={`flex text-orange-500 ${size}`}>
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{
              fill: i <= Math.floor(rating) ? '1' : i <= rating ? '0.5' : '0',
            }}
          >
            star
          </span>
        ))}
      </div>
    );
  };


  return (
    <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-500/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/recipes')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              title="Go back"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <span className="material-symbols-outlined text-xl">restaurant</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DishHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500/20">
              <img alt="Profile" className="h-full w-full object-cover" src="https://ui-avatars.com/api/?name=User&background=random" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-slate-200 shadow-xl lg:h-[450px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
          <img
            alt={recipe.title}
            className="h-full w-full object-cover"
            src={recipe.image || 'https://via.placeholder.com/1200x450'}
          />
          <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <nav className="mb-2 flex gap-2 text-sm font-medium text-white/80">
                  <span style={{ backgroundColor: '#f27f0d' }} className="rounded px-2 py-0.5 text-xs text-white">
                    {recipe.category || 'Recipe'}
                  </span>
                </nav>
                <h2 className="text-3xl font-extrabold text-white md:text-5xl">{recipe.title}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  style={{ backgroundColor: '#f27f0d' }}
                  className="flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined">calendar_today</span>
                  Add to Meal Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Meta */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-orange-500/10 bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">schedule</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Prep Time</p>
                <p className="font-bold dark:text-white">{recipe.prepTime || 0} Mins</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">restaurant</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Servings</p>
                <p className="font-bold dark:text-white">{recipe.servings || 2} People</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">star</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Rating</p>
                <p className="font-bold dark:text-white">{recipe.rating || 0} ⭐</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Ingredients & Instructions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold dark:text-white">
                <span className="material-symbols-outlined text-orange-500">shopping_basket</span>
                Ingredients
              </h3>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {recipe.ingredients.map(ingredient => (
                    <label key={ingredient.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-orange-500/5 dark:border-slate-800 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checkedIngredients.has(ingredient.id.toString())}
                        onChange={() => toggleIngredient(ingredient.id.toString())}
                        className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                      />
                      <span className={`${checkedIngredients.has(ingredient.id.toString()) ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {ingredient.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No ingredients available</p>
              )}
            </section>

            {/* Instructions */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold dark:text-white">
                <span className="material-symbols-outlined text-orange-500">list_alt</span>
                Instructions
              </h3>
              {recipe.instructions ? (
                <div className="space-y-8">
                  <p className="text-slate-600 dark:text-slate-400">{recipe.instructions}</p>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No instructions available</p>
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="space-y-8">
            {/* Nutritional Facts */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <h3 className="mb-4 text-xl font-bold dark:text-white">Nutritional Facts</h3>
              <p className="mb-6 text-sm text-slate-500">Approximate values per serving</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-orange-500/5 p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{recipe.nutrition?.totalCalories || 0}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Calories</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{recipe.nutrition?.totalProtein || 0}g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Protein</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{recipe.nutrition?.totalFat || 0}g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Fat</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{recipe.nutrition?.totalCarbs || 0}g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Carbs</p>
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <h3 className="mb-4 text-xl font-bold dark:text-white">Recipe Info</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Category:</span> <span className="text-slate-600 dark:text-slate-400">{recipe.category || 'N/A'}</span></p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Cook Time:</span> <span className="text-slate-600 dark:text-slate-400">{recipe.cookTime || 0} mins</span></p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Difficulty:</span> <span className="text-slate-600 dark:text-slate-400">{recipe.difficulty || 'N/A'}</span></p>
              </div>
            </section>
          </aside>
        </div>

        {/* Ratings & Comments */}
        <section className="mt-12 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold dark:text-white">Ratings & Comments</h3>
              <div className="mt-3 flex items-center gap-2">
                {renderStars(recipe.rating || 0)}
                <span className="font-bold dark:text-white">{recipe.rating || 0}</span>
                <span className="text-slate-500">({reviewsData?.content.length || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Comment Input Form */}
          <div className="mb-10 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <h4 className="mb-4 font-bold text-slate-900 dark:text-white">Write a Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i)}
                      className={`text-2xl transition-colors ${
                        i <= reviewRating ? 'text-orange-500' : 'text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fill: '1' }}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Comment</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Share your experience making this recipe..."
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={createReviewMutation.isPending}
                style={{ backgroundColor: '#f27f0d' }}
                className="w-full rounded-lg px-4 py-2 font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createReviewMutation.isPending ? '⏳ Submitting...' : '✓ Post Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <span className="material-symbols-outlined text-2xl text-orange-500">refresh</span>
              </div>
              <p className="mt-2 text-slate-500">Loading reviews...</p>
            </div>
          ) : reviewsData?.content && reviewsData.content.length > 0 ? (
            <div className="space-y-6">
              {reviewsData.content.map((review: Review) => (
                <div key={review.id} className="flex gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                    <img
                      alt={review.userName}
                      className="h-full w-full object-cover"
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white">{review.userName}</h4>
                      <span className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1">
                      {renderStars(review.rating, 'text-sm')}
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white px-4 py-8 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div style={{ backgroundColor: '#f27f0d' }} className="flex h-6 w-6 items-center justify-center rounded text-white">
              <span className="material-symbols-outlined text-sm">restaurant</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">DishHub</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 DishHub Inc. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm font-medium text-slate-500">
            <a className="hover:text-orange-500 transition-colors" href="#">About</a>
            <a className="hover:text-orange-500 transition-colors" href="#">Recipes</a>
            <a className="hover:text-orange-500 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-orange-500 transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecipeDetailPage;
