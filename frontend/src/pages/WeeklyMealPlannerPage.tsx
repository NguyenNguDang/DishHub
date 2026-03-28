import React, { useState } from 'react';

interface Meal {
  name: string;
  calories: number;
  image: string;
}

interface Day {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meals: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snack: Meal | null;
  };
  isHighlight?: boolean;
}

const WeeklyMealPlannerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [days, setDays] = useState<Day[]>([
    {
      name: 'Monday',
      calories: 2100,
      protein: 150,
      fat: 70,
      carbs: 220,
      meals: {
        breakfast: null,
        lunch: { name: 'Quinoa Buddha Bowl', calories: 450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEXah1rF-QTmLAzoy6GV8bvRwtU1K0eyWYFqra0Sx0DQXozNWbsYEAA856FsgkqCbJ1EqaEWPWDeGJ_VPYJdoiHq2gaHX43yL2bISt7UZU-SSS33zhBPh_M7MLiGzfvzDnOdATkqWRujNTZz-nG3LddYML5kM2nGGc6bazOPH9qP5ILS-hwZMBPghpOaSnOvYpaRky3uC6-uaXS0cAt7--oR5BH8sTA6gNTsgYXsvzcNOsQmF2mFd8w1Eax4n8xtc6hTqFuDBlS1YZ' },
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Tuesday',
      calories: 1850,
      protein: 120,
      fat: 65,
      carbs: 190,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Wednesday',
      calories: 2000,
      protein: 140,
      fat: 80,
      carbs: 210,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Thursday',
      calories: 1900,
      protein: 130,
      fat: 70,
      carbs: 180,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Friday',
      calories: 2200,
      protein: 160,
      fat: 75,
      carbs: 230,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Saturday',
      calories: 2400,
      protein: 140,
      fat: 95,
      carbs: 250,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
    },
    {
      name: 'Sunday',
      calories: 2000,
      protein: 145,
      fat: 70,
      carbs: 200,
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
      },
      isHighlight: true,
    },
  ]);

  const totalGroceryItems = 42;
  const weeklyPrepTime = 4.5;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-orange-500">
            <div className="w-6 h-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">DishHub</h2>
          </div>
          
          <label className="flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
              <div className="text-slate-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="flex w-full border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-0 h-full placeholder:text-slate-500 px-4 pl-2 text-sm font-normal"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-9">
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-orange-500 transition-colors" href="#">Home</a>
            <a className="text-orange-500 text-sm font-bold border-b-2 border-orange-500" href="#">Recipes</a>
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-orange-500 transition-colors" href="#">Orders</a>
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-orange-500 transition-colors" href="#">Profile</a>
          </nav>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 ring-2 ring-orange-500/20 bg-gradient-to-br from-blue-400 to-purple-500"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-4 md:px-10 py-8 max-w-[1440px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight">Weekly Meal Planner</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Organize your week, track your macros, and eat better.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-500/20 transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>
              Export List
            </button>
            <button
              style={{ backgroundColor: '#f27f0d' }}
              className="text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Generate AI Plan
            </button>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-6">
          {days.map((day, index) => (
            <div
              key={day.name}
              className={`flex flex-col min-w-[200px] bg-white dark:bg-slate-900 rounded-xl border shadow-sm transition-all ${
                day.isHighlight
                  ? 'border-orange-500/40 ring-2 ring-orange-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              } ${index === 1 ? 'opacity-90' : ''}`}
            >
              {/* Day Header */}
              <div
                className={`p-4 border-b rounded-t-xl ${
                  day.isHighlight
                    ? 'bg-orange-500/5 dark:bg-orange-500/10 border-slate-100 dark:border-slate-800'
                    : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                }`}
              >
                <p className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-2">{day.name}</p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Calories</span>
                    <span className="font-bold text-orange-500">{day.calories.toLocaleString()} kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] uppercase font-bold text-slate-400">
                    <div className="flex flex-col">
                      <span>Pro</span>
                      <span className="text-slate-700 dark:text-slate-200">{day.protein}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Fat</span>
                      <span className="text-slate-700 dark:text-slate-200">{day.fat}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Carb</span>
                      <span className="text-slate-700 dark:text-slate-200">{day.carbs}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Slots */}
              <div className="p-3 space-y-4">
                {/* Breakfast */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Breakfast</span>
                  </div>
                  {day.meals.breakfast ? (
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.breakfast.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.breakfast.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.breakfast.calories} kcal</p>
                    </div>
                  ) : (
                    <div className="group relative rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 hover:border-orange-500/50 transition-all cursor-pointer">
                      <button className="w-full flex items-center justify-center gap-2 text-slate-400 group-hover:text-orange-500">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        <span className="text-xs font-semibold">Add Recipe</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Lunch */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lunch</span>
                  </div>
                  {day.meals.lunch ? (
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.lunch.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.lunch.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.lunch.calories} kcal</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all">
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span className="text-xs font-semibold">Add Recipe</span>
                    </div>
                  )}
                </div>

                {/* Dinner */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dinner</span>
                  <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    <span className="text-xs font-semibold">Add Recipe</span>
                  </div>
                </div>

                {/* Snack */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Snack</span>
                  <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    <span className="text-xs font-semibold">Add Recipe</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary / Stats */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Grocery Count */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <h3 className="font-bold dark:text-white">Grocery Count</h3>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {totalGroceryItems}
              <span className="text-sm font-normal text-slate-500 ml-2">Items</span>
            </p>
            <a className="text-orange-500 text-sm font-bold mt-2 inline-block hover:underline" href="#">View Shopping List →</a>
          </div>

          {/* Weekly Prep Time */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <h3 className="font-bold dark:text-white">Weekly Prep Time</h3>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {weeklyPrepTime}
              <span className="text-sm font-normal text-slate-500 ml-2">Hours</span>
            </p>
          </div>

          {/* Macro Balance */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <span className="material-symbols-outlined">nutrition</span>
              </div>
              <h3 className="font-bold dark:text-white">Macro Balance</h3>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div style={{ backgroundColor: '#f27f0d', width: '30%' }} className="h-full"></div>
              <div style={{ backgroundColor: '#f27f0d', opacity: 0.6, width: '30%' }} className="h-full border-l border-white dark:border-slate-900"></div>
              <div style={{ backgroundColor: '#f27f0d', opacity: 0.3, width: '40%' }} className="h-full border-l border-white dark:border-slate-900"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Pro</span>
              <span>Fat</span>
              <span>Carb</span>
            </div>
          </div>

          {/* Plan Shared */}
          <div style={{ backgroundColor: '#f27f0d' }} className="p-6 text-white rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-1">Plan Shared</h3>
              <p className="text-xs opacity-90 mb-4">Your household can see this plan.</p>
              <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors">
                Invite Members
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <span className="material-symbols-outlined text-[100px]">group</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyMealPlannerPage;
