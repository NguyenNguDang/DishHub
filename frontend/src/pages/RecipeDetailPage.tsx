import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Ingredient {
  id: string;
  name: string;
  checked: boolean;
}

interface Instruction {
  number: number;
  title: string;
  description: string;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  rating: number;
  comment: string;
}

const RecipeDetailPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '2 Fresh Salmon Fillets (6oz each)', checked: false },
    { id: '2', name: '2 tbsp White Miso Paste', checked: false },
    { id: '3', name: '1 tbsp Mirin', checked: false },
    { id: '4', name: '1 tbsp Honey or Maple Syrup', checked: false },
    { id: '5', name: '1 cup Jasmine Rice', checked: false },
    { id: '6', name: '1 cup Steamed Bok Choy', checked: false },
    { id: '7', name: '1 tsp Sesame Seeds', checked: false },
    { id: '8', name: 'Green onions, thinly sliced', checked: false },
  ]);

  const instructions: Instruction[] = [
    {
      number: 1,
      title: 'Prepare the Glaze',
      description: 'In a small bowl, whisk together the miso paste, mirin, honey, and a splash of soy sauce until smooth. If the miso is too thick, add a teaspoon of warm water.',
    },
    {
      number: 2,
      title: 'Marinate Salmon',
      description: 'Pat the salmon fillets dry. Brush the glaze generously over the top and sides of the salmon. Let it marinate for at least 15 minutes at room temperature.',
    },
    {
      number: 3,
      title: 'Cook the Salmon',
      description: 'Preheat your oven to 400°F (200°C). Place salmon on a parchment-lined baking sheet and bake for 12-15 minutes, or until the salmon flakes easily with a fork and the glaze is caramelized.',
    },
    {
      number: 4,
      title: 'Assemble the Bowl',
      description: 'Divide the cooked jasmine rice between two bowls. Top with the salmon and steamed bok choy. Garnish with sesame seeds and green onions.',
    },
  ];

  const reviews: Review[] = [
    {
      id: '1',
      author: 'Sarah Jenkins',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=3B82F6&color=fff',
      timestamp: '2 days ago',
      rating: 5,
      comment: 'The glaze is absolutely divine! I didn\'t have mirin so I used a bit of rice vinegar and honey instead, turned out great. Definitely adding this to our weekly rotation.',
    },
    {
      id: '2',
      author: 'Marcus Wong',
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Wong&background=8B5CF6&color=fff',
      timestamp: '1 week ago',
      rating: 4,
      comment: 'Excellent recipe. I broiled the salmon for the last 2 minutes to get that perfect char on the miso glaze. Make sure not to overcook the salmon!',
    },
  ];

  const [commentText, setCommentText] = useState('');

  const toggleIngredient = (id: string) => {
    setIngredients(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
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
            <Link
              to="/recipes"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              title="Quay lại"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
            </Link>
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
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500/20 bg-gradient-to-br from-blue-400 to-purple-500">
              <img alt="Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhzin0mhRfIfHXVtP19gvjQnGHTyEYzalGQAhZCgRwqY3cgcNqgXAnj5wkZZXLUd3N--u0StRRkHbtfy5VQHRDBS9tcz0PDv6coPAvZxz6tgUn3mtZg1PSHWkHd63u0zdguv7jpRhDBc-6tdWFPT_EGYxhkAjtEYf_KXf_qOaCCQ_Ao2LEWZzqWzCsm2Y6372WTuSC65SdmxZdZ00YWjqsYUxriI39XCXTkNCWH7ap9VJnhJ-E1cyzvbEh9iGYhQRnGDH5QcAxNkhl" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-slate-200 shadow-xl lg:h-[450px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
          <img
            alt="Glazed Miso Salmon Bowl"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-CghtB1y1E_dWOWoQ9I6xPEnbCg0iRii97DYSN-PUZhpQ4czT2-Z_nasBdjDOtfvlXyg809vbNAeMIM9EIBGve7drI9XlT3mHYME0kMRlhQ2iEUq4jBAjWj_38RFcxBV5F8f1NKkP_7ftCTUIwTtOnrlyn30KU6ZgL-juKVMKyVadVR78NNMcUvzZRkG3pmx2koQ1FWXq8j_qZ0WCM2enZ2OBZS2Xw7jA3LkzFR8_5TCZijxOnbmpB9AuYpxIwgvS7o_K9tBXNodr"
          />
          <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <nav className="mb-2 flex gap-2 text-sm font-medium text-white/80">
                  <span style={{ backgroundColor: '#f27f0d' }} className="rounded px-2 py-0.5 text-xs text-white">Main Course</span>
                  <span className="rounded bg-white/20 px-2 py-0.5 text-xs backdrop-blur-sm">Japanese Fusion</span>
                </nav>
                <h2 className="text-3xl font-extrabold text-white md:text-5xl">Glazed Miso Salmon Bowl</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  style={{ backgroundColor: '#f27f0d' }}
                  className="flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined">calendar_today</span>
                  Add to Meal Plan
                </button>
                <button className="flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-orange-500">
                  <span className="material-symbols-outlined">fork_right</span>
                  Fork Recipe
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
                <p className="font-bold dark:text-white">25 Mins</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">bar_chart</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Difficulty</p>
                <p className="font-bold dark:text-white">Intermediate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">group</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Servings</p>
                <p className="font-bold dark:text-white">2 People</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Recipe Visibility</p>
              <p className="text-xs text-slate-500">Public visibility enabled</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input defaultChecked className="peer sr-only" type="checkbox" />
              <div className="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ingredients.map(ingredient => (
                  <label key={ingredient.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-orange-500/5 dark:border-slate-800 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={ingredient.checked}
                      onChange={() => toggleIngredient(ingredient.id)}
                      className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                    />
                    <span className={`${ingredient.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {ingredient.name}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Instructions */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold dark:text-white">
                <span className="material-symbols-outlined text-orange-500">list_alt</span>
                Instructions
              </h3>
              <div className="space-y-8">
                {instructions.map(instruction => (
                  <div key={instruction.number} className="flex gap-4">
                    <div style={{ backgroundColor: '#f27f0d' }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white">
                      {instruction.number}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold dark:text-white">{instruction.title}</h4>
                      <p className="leading-relaxed text-slate-600 dark:text-slate-400">{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  <p className="text-2xl font-bold text-orange-500">540</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Calories</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">34g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Protein</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">22g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Fat</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">48g</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Carbs</p>
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <h3 className="mb-4 text-xl font-bold dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['#HighProtein', '#Dinner', '#Omega3', '#Japanese'].map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {tag}
                  </span>
                ))}
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
                {renderStars(4.8)}
                <span className="font-bold dark:text-white">4.8</span>
                <span className="text-slate-500">(124 reviews)</span>
              </div>
            </div>
            <button className="rounded-lg bg-orange-500/10 px-6 py-2 font-bold text-orange-500 transition-colors hover:bg-orange-500/20">
              Write a Review
            </button>
          </div>

          {/* Comment Input */}
          <div className="mb-10 flex gap-4">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 focus:border-orange-500 focus:ring-orange-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white placeholder:text-slate-500"
                placeholder="Share your experience making this recipe..."
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button style={{ backgroundColor: '#f27f0d' }} className="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-8">
            {reviews.map(review => (
              <div key={review.id} className="flex gap-4 border-b border-slate-100 pb-8 dark:border-slate-800">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                  <img alt={review.author} className="h-full w-full object-cover" src={review.avatar} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold dark:text-white">{review.author}</h4>
                    <span className="text-sm text-slate-500">{review.timestamp}</span>
                  </div>
                  <div className="mt-1">
                    {renderStars(review.rating, 'text-xs')}
                  </div>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
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
