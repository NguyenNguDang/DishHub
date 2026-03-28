import React, { useState } from 'react';
import { Heart, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Recipe {
  id: string;
  title: string;
  calories: number;
  rating: number;
  chef: string;
  chefImage: string;
  image: string;
  isFavorite: boolean;
}

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

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ['All', 'Breakfast', 'Vegan', 'Quick & Easy', 'Gluten-Free', 'Desserts'];

  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Zen Garden Buddha Bowl',
      calories: 450,
      rating: 4.5,
      chef: 'David Chen',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUEwqXKIFeCiK-43VePPIZMAS-6M5CD0ci7nwWtRd1gAOdolzvpBSHqcVc1OqNTtN0RB0AnxzES5Mm5Eqvwlkh0Arr1APpsa3yz51qlGOP2ScI6UredQA7DGtIcYdklxWXUu3_x4hRBR6eD0Pv53tlseB5TmSj4YYs7SYP3XIoi_YSZENiwsYQXku_L8iU8wkdoASLWcJxTM_AO-lf4_TJUQIApkIXB496MyyjtEH_GNND5AO8t4IppD1bjiyV44FDkFW0ayxbRO7v',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8e_NgLFd7sTSYQxA1eHVs-xPBzK5B0hhS0SMDO1N_ZD0CU2BBL77vHPM5yG8G2LOJzNvxjCfKwB_F7W9e9Nwe2fSQIFJLOFVjlnFqMqXkPt5V_wL1I0fHb8IDJZ0fZO_eQhXtWRFmX0q0qsKtPfJ73NXHOTkPdO3e-eVU5BZCMiyjlp4TYKYSdFjdHCJ2W-uM8EAJHVMQD-Eo6jrZY3K0g6xpM5QkN7lUYLHlUJELmGj0N1UoRIKG5jJ3xW-n6v5gCJgT6nRqOvPQ2Fc8QT3CQ_75pMwFQYYdPWARXUSL8TN_VngL8j9jLBvv0DvvOJz8LFiqCFQhOX',
    },
    {
      id: '2',
      title: 'Homemade Basil Pesto Linguine',
      calories: 620,
      rating: 4.9,
      chef: 'Julia Smith',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFp_yqUMVnEsmlYpGqvKYNo8XjfwR6iL8LOB0dcWyjLLZgmoAucppJwy5W8a35GcBwH8n8ju8FE3bIZHLLjvPE4Joa4FBJwBO7oBXNtzG7jOVezrsL7iTMxSLPu0w4arRCXN8HsO3_OD3DeVa0PnwoPP5KVkqiEIl-9sOu6kcMQmglnGYuFC6kY55yC99VaZF2VwazkbgIJb6viIe5NEabJzRRZtfAeP2fBIdPH6b8Wq9hQIsUwf-UuJeKFvxVUgi3txn5eUT0Khb_',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_mAoX4uojyXwnN2OOsLoflhZ6OA1dHd4Ljlj788eg_PV_Nbi_z5ZF_bXVhNECShZGMAZ6ecXWq3EF-gSw0GeQvHHoihQETwckBLw2eHprQZpuYVLQTiJ6eN8jX7JJ32Daa8zQfWxbuFdRrDjHp3nxa_QY8Z35mHa3iEBJleZi9AOjRCVpTyWkvgbxK-LT5J7buA_WUIpeQVxyRunb3hfjwQHZrfDPnGYt5lLDk-TmCAw0MGi73RjN7LLUEkLOS_jzFt-RBWExLt6L',
    },
    {
      id: '3',
      title: 'Smoked Salmon Breakfast Toast',
      calories: 280,
      rating: 4.7,
      chef: 'Sarah Connor',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAouNmRMPl2xwP745DzTxac95VTaPiumd2qfsXtckhK2IBksJ3lnmvCPwTUcmHLgZvqNX7zgzJVQYKNP8YDTNicaOEEEeYxbdWI6pgadJVcdKUBDqUQsdPwLfIVDho9pIni0MUKHst05zN18nNJdHg1u0z0fTEYdtpd8WjdLQOJO9AH2j5n-Lfm4wceJ2tfwhhJ27uQqe_I9SgkynZnIaBl7eo6ynlWvvI-ZoIJzUny1VXOSqAVPLGXxK-3WJcGYWE0_wf9cps1Ol1O',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-w25h4iTWvcZqcCdXfbxPbvYL2LOaODg6nZAThEZomtRdhmg9EQaA6blEppE5XLQTVXdZq91yvbONQbMgjFD4We_2-eeZHgfSDOINdUS3stKIts2WYsqs3s6u9BulAxYacaPBNZ4hj3i9lc66SasYc3zRpsASs2oV-LZSUIyWOK-zfi9JJHNm05l1kKPCX828Y_ACAUwwvPmzCD--JqXrtmNvsWXvRYysJMbduQoObN0946qq1T63uZRlHCVkCqjwNPuq7yjJI2c',
    },
    {
      id: '4',
      title: 'Artisan Sourdough Melts',
      calories: 540,
      rating: 4.6,
      chef: 'Mike Ross',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ_UTrNTjUzorRL-V0e8WJKTVxm5swwVZcawSfITjvz2w0zcIKPCaeEoSJAR30ByBK7syAIdi8ywyh28X7A8UNnPLMsXWii6vEwPw1IFsqx5KFOu0bAFoVsWY0mbpUBOXVaIdF7h2q5nPnY3Go5lJ-wPuEv8FeDQpTPHOn56bl1tPgiuoufIhPklQulcuNb04N2KyRRPn_nrYN1bcNhYjjtj8f7ouDcF1EumCDJhJKLKKV8kVxjbH_tEyKdJCVeqveEyi77za40H7',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEaAMAS3o5zlX2pq8eSgT4mrtH1XITYBDW5XuCNW09VAcONOq-LtWB2y6s0WKNWOQXEr3boiPTFXkxktquHeQEMpslwgwJgcRb2dcmgrTFW_D4pQlELyJKjQw5vlFEOZSBaujfEwLMrloZDg0DKTkBDi2Iv4ilRen-hUGWkG8AMowS9dq97j8sVP5POAZgbMmtJCzFQXmDEpMhnWCH1HJOhFZoq_tjFH22Tx_BKl72SHdYH7Hfnm1a5Vedscexub_vvPqPvXCrYD3w',
    },
    {
      id: '5',
      title: 'Brioche French Toast Platter',
      calories: 710,
      rating: 4.4,
      chef: 'Leo Wright',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq3PIGWy_Cy7_umS4i4pTxsh0UPQ1USmG8cdCZ8WGU8l0nYqZJBosNf_xizn1bynIjETPdUeQ_nFPQi8m89nOXZKJ3pJ9UwD1nhWMUtMdCMhFb7iTW2xJnhWBDqvePvAnzzL3lIvILNPPhQOu7vMGYQ-UPxIy28cAqM8MqrvXLuvCy6ROwfIe6vQ9BM6h0cS0nLWeN4qlmApHXFA3t3alGmgqJRLtFNgA3bNRPTsKcaiuYtLkRXkuuP6KthjkFq0dO-2gjxM7e78V7',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsE-HMmf4P6K02QHdb4irWhfdKEfhf2hSQf9vnDvTbUsgLHTV38XdoDRpBuRy0bPwuB7iN1lLreUmdx_aySlgBAvE4UCYpjyrm5CoQVtMA0kuk7qJOJzvVzXBVcMzj6AZgyIfZo2UBPlNiBEbIsubu2ZoSrRfuqN0LJa3F6Cn_g_lHXWkMN2xoNWZy4m7ODvnMvpJ1TPPAFT0o6I8HQJ3mw_AS9A8OURdqYtPc1mqjnlwcT8sQBZ-f3z5tQSutroX4s6X9nkNrgILq',
    },
    {
      id: '6',
      title: 'Spiced Chicken Souvlaki',
      calories: 390,
      rating: 4.7,
      chef: 'Alex Jones',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBodmSQcrSWBmCVe63qjM6WC5-qfEk78WYup8PqYUlRiPKqjrhcrXiZPz7PFD52wsGbrabC6snGqT4wj9bdAYlFpl96heGQGlYh9jREop7ahWK0Vu9IDLS_9rFbXHkFmZITQyo0K9Bitg_uMmq8cotWW2LpcFRigEmZqmaGeoB3NZMZFj3tqdZ7ZpaFJyk6Y66tJQ09Tyg-wFlG5_69SrAX6MZmtONc8l0e5qI40qZDkOqvhn2inM5PWtFWlyu2DvMXn3HBtagIEXuN',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyE6UPtAA91xztPWli7jHz0-F_YIHldMGMLTOxDu6D55XHqSnPu9PSmMGC47g9of9A0k1ziiePxcLTehXcLvN74JFaukP3NUel1Ch2jdO_1xYIAvHDPKDWOhErLLJ8WmleA-9ZgDnb982MLmt-HD8f8JOjU6NgojMtxyyGVvKs6DdFyFwOKrl9x-RY9q-NbIbsvTLmrzJCDjmDCxVbrRVrCyM5oZUup5XDujl8WwQWgKs1YSM4K4hya6_JuBcml2bhwJRn3sraLGV2',
    },
    {
      id: '7',
      title: 'Glazed Miso Salmon Bowl',
      calories: 425,
      rating: 4.9,
      chef: 'Elena Parker',
      chefImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdAo-_TwiWclHfNIyOluq3xZPRkTBxSxBjpUxLhucoHtBRAX6D3jEklJwfkY-zZle0w5K0V_TkjWNfERrVAYKNruWwp8xqxhqS3KGrqApYiNCbqntHXbEU7qZovLarWuNboJEZ_w2-6PPtTX6N6PfWFTnLmfPdMnpjQwXBxb5g05Y-A6MRdLnT3EUn50e43HJWFtm1MWzKDmOADHERR2HwGvyuqcRhQkf98eo_CHaIKPNngdL53umA7cWruzgnzxrQgCGyBfcEHwFy',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUrgROEdXXH8bd9n2aCsdIIOTrQxMg2j4AcnihxKVzEnUrb1A3b4vHE8i_bI2CGxx4qCezc8VqeBNVmygHalRu2mtATCY4Pymb-N6uoe-nGGmH7i1XoCWBu9eoFSgIdWBzikZrZxjw_D4g4j80JNHV45bhkvUUgiAc_9J59Z1Ks9nqMZkLRr8viUDyFNO2hhdtPHhR52WbyhazddnF7iItwAiaiU52ELUUUbUfhpRRkNS9Df7NEibnQXUWKeSZAZDxyGQIv8L3HsAe',
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

  const handleCategoryClick = (category: string) => {
    setFilters({ ...filters, category });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-orange-500">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="font-bold text-lg dark:text-white">DishHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500">Home</a>
            <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500">Recipes</a>
            <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500">Orders</a>
            <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500">Profile</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Hero Section */}
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
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <button
            style={{ backgroundColor: '#f27f0d' }}
            className="px-6 py-3 text-white font-semibold rounded-lg transition-opacity"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
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
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
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
          {mockRecipes.map((recipe) => (
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
                    {recipe.calories} kcal
                  </span>
                </div>
                {/* Chef Profile */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full bg-center bg-cover"
                    style={{ backgroundImage: `url("${recipe.chefImage}")` }}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{recipe.chef}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center py-8">
          <button
            style={{ borderColor: '#f27f0d', color: '#f27f0d' }}
            className="flex items-center gap-2 px-8 py-3 rounded-full border-2 font-bold transition-all hover:bg-orange-500 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f27f0d';
              e.currentTarget.style.color = 'white';
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
