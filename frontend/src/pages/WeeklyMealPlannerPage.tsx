import React, {useMemo, useState} from 'react';
import {useGetRecipes, useGetWeeklyMealPlans, useCreateMealPlan, useDeleteMealPlanByDateAndType} from '../hooks';
import type {Recipe} from '../types';

interface Meal {
  id?: string;
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
  // API hooks
  const { data: recipesData } = useGetRecipes();
  const recipes = useMemo(() => recipesData || [], [recipesData]);
  const recipesById = useMemo(() => {
    return new Map(recipes.map((recipe) => [String(recipe.id), recipe]));
  }, [recipes]);

  // Get current week's Monday
  const getCurrentWeekMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    return monday.toISOString().split('T')[0];
  };

  const weekStartDate = getCurrentWeekMonday();

  // Fetch weekly meal plans
  const { data: weeklyMealPlans } = useGetWeeklyMealPlans(weekStartDate);
  const weeklyMealPlansSafe = useMemo(() => weeklyMealPlans ?? [], [weeklyMealPlans]);

  // Mutations
  const createMealPlanMutation = useCreateMealPlan({
    onSuccess: () => {
      // Meal plans will be refetched automatically via queryClient invalidation
    },
    onError: (error) => {
      alert(`Failed to save meal plan: ${error.message}`);
    },
  });

  const deleteMealPlanMutation = useDeleteMealPlanByDateAndType({
    onSuccess: () => {
      // Meal plans will be refetched automatically
    },
    onError: (error) => {
      alert(`Failed to delete meal plan: ${error.message}`);
    },
  });

  // Base day structure for UI
  const baseDays = useMemo<Day[]>(() => [
    {
      name: 'Monday',
      calories: 2100,
      protein: 150,
      fat: 70,
      carbs: 220,
      meals: {
        breakfast: null,
        lunch: null,
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
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    },
    {
      name: 'Wednesday',
      calories: 2000,
      protein: 140,
      fat: 80,
      carbs: 210,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    },
    {
      name: 'Thursday',
      calories: 1900,
      protein: 130,
      fat: 70,
      carbs: 180,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    },
    {
      name: 'Friday',
      calories: 2200,
      protein: 160,
      fat: 75,
      carbs: 230,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    },
    {
      name: 'Saturday',
      calories: 2400,
      protein: 140,
      fat: 95,
      carbs: 250,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    },
    {
      name: 'Sunday',
      calories: 2000,
      protein: 145,
      fat: 70,
      carbs: 200,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
      isHighlight: true,
    },
  ], []);

  const [optimisticMeals, setOptimisticMeals] = useState<Record<string, Meal | null>>({});

  const plannedDays = useMemo(() => {
    return baseDays.map((day) => {
      const dayMealPlans = weeklyMealPlansSafe.filter((mp) => {
        // Parse plan date and compare with day
        const mealPlanDate = new Date(mp.planDate);
        const dayDate = new Date();
        const dayOfWeek = dayDate.getDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        dayDate.setDate(dayDate.getDate() - daysFromMonday);

        // Get the target date for this day
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = daysOfWeek.indexOf(day.name);
        const targetDate = new Date(dayDate);
        targetDate.setDate(dayDate.getDate() + (dayIndex === 0 ? 6 : dayIndex - 1));

        return mealPlanDate.toDateString() === targetDate.toDateString();
      });

      const updatedMeals = { ...day.meals };
      dayMealPlans.forEach((mp) => {
        const mealType = mp.mealType.toLowerCase() as keyof typeof updatedMeals;
        if (mealType in updatedMeals) {
          updatedMeals[mealType] = {
            id: mp.recipeId.toString(),
            name: mp.recipeName,
            calories: 0, // Could fetch from recipe if needed
            image: mp.recipeImage || 'https://via.placeholder.com/300',
          };
        }
      });

      (['breakfast', 'lunch', 'dinner', 'snack'] as const).forEach((mealType) => {
        const overrideKey = `${day.name}:${mealType}`;
        if (Object.prototype.hasOwnProperty.call(optimisticMeals, overrideKey)) {
          updatedMeals[mealType] = optimisticMeals[overrideKey];
        }
      });

      return { ...day, meals: updatedMeals };
    });
  }, [baseDays, weeklyMealPlansSafe, optimisticMeals]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleAddMeal = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedDay(dayIndex);
    setSelectedMealType(mealType);
    setShowModal(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if (selectedDay === null || !selectedMealType) return;

    const selectedDayData = plannedDays[selectedDay];
    if (!selectedDayData) return;

    const optimisticKey = `${selectedDayData.name}:${selectedMealType}`;
    setOptimisticMeals((prev) => ({
      ...prev,
      [optimisticKey]: {
        id: recipe.id,
        name: recipe.title,
        calories: Math.round(recipe.nutrition?.totalCalories || 0),
        image: recipe.image || 'https://via.placeholder.com/300',
      },
    }));

    // Prepare date for API
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(selectedDayData.name);
    const planDate = new Date(monday);
    planDate.setDate(monday.getDate() + (dayIndex === 0 ? 6 : dayIndex - 1));
    const planDateStr = planDate.toISOString().split('T')[0];

    // Call API to save meal plan
    createMealPlanMutation.mutate(
      {
        recipeId: Number(recipe.id),
        planDate: planDateStr,
        mealType: selectedMealType,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setSelectedDay(null);
          setSelectedMealType(null);
        },
        onError: () => {
          setOptimisticMeals((prev) => {
            const next = { ...prev };
            delete next[optimisticKey];
            return next;
          });
        },
      }
    );
  };

  const handleRemoveMeal = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const selectedDayData = plannedDays[dayIndex];
    if (!selectedDayData) return;

    const optimisticKey = `${selectedDayData.name}:${mealType}`;
    setOptimisticMeals((prev) => ({
      ...prev,
      [optimisticKey]: null,
    }));

    // Prepare date for API
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNameIndex = daysOfWeek.indexOf(selectedDayData.name);
    const planDate = new Date(monday);
    planDate.setDate(monday.getDate() + (dayNameIndex === 0 ? 6 : dayNameIndex - 1));
    const planDateStr = planDate.toISOString().split('T')[0];

    // Call API to delete meal plan
    deleteMealPlanMutation.mutate(
      {
        date: planDateStr,
        mealType: mealType,
      },
      {
        onSuccess: () => {},
        onError: () => {
          setOptimisticMeals((prev) => {
            const next = { ...prev };
            delete next[optimisticKey];
            return next;
          });
        },
      }
    );
  };

  const totalGroceryItems = useMemo(() => {
    return weeklyMealPlansSafe.reduce((sum, plan) => {
      const recipe = recipesById.get(String(plan.recipeId));
      return sum + (recipe?.ingredients?.length || 0);
    }, 0);
  }, [weeklyMealPlansSafe, recipesById]);

  const weeklyPrepTime = useMemo(() => {
    const totalMinutes = weeklyMealPlansSafe.reduce((sum, plan) => {
      const recipe = recipesById.get(String(plan.recipeId));
      const prep = recipe?.prepTime || 0;
      const cook = recipe?.cookTime || 0;
      return sum + prep + cook;
    }, 0);
    return Number((totalMinutes / 60).toFixed(1));
  }, [weeklyMealPlansSafe, recipesById]);

  const macroBalance = useMemo(() => {
    const totals = weeklyMealPlansSafe.reduce(
      (sum, plan) => {
        const recipe = recipesById.get(String(plan.recipeId));
        return {
          protein: sum.protein + (recipe?.nutrition?.totalProtein || 0),
          fat: sum.fat + (recipe?.nutrition?.totalFat || 0),
          carbs: sum.carbs + (recipe?.nutrition?.totalCarbs || 0),
        };
      },
      { protein: 0, fat: 0, carbs: 0 }
    );

    const totalMacros = totals.protein + totals.fat + totals.carbs;
    if (totalMacros <= 0) {
      return { protein: 0, fat: 0, carbs: 0 };
    }

    const protein = Math.round((totals.protein / totalMacros) * 100);
    const fat = Math.round((totals.fat / totalMacros) * 100);
    const carbs = Math.max(0, 100 - protein - fat);

    return { protein, fat, carbs };
  }, [weeklyMealPlansSafe, recipesById]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">

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
          {plannedDays.map((day, index) => (
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
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2 relative group">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.breakfast.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.breakfast.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.breakfast.calories} kcal</p>
                      <button
                        onClick={() => handleRemoveMeal(index, 'breakfast')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleAddMeal(index, 'breakfast')}
                      className="group relative rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 hover:border-orange-500/50 transition-all cursor-pointer"
                    >
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
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2 relative group">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.lunch.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.lunch.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.lunch.calories} kcal</p>
                      <button
                        onClick={() => handleRemoveMeal(index, 'lunch')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleAddMeal(index, 'lunch')}
                      className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span className="text-xs font-semibold">Add Recipe</span>
                    </div>
                  )}
                </div>

                {/* Dinner */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dinner</span>
                  {day.meals.dinner ? (
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2 relative group">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.dinner.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.dinner.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.dinner.calories} kcal</p>
                      <button
                        onClick={() => handleRemoveMeal(index, 'dinner')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleAddMeal(index, 'dinner')}
                      className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span className="text-xs font-semibold">Add Recipe</span>
                    </div>
                  )}
                </div>

                {/* Snack */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Snack</span>
                  {day.meals.snack ? (
                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-2 relative group">
                      <div
                        className="w-full rounded-md aspect-video mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url('${day.meals.snack.image}')` }}
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{day.meals.snack.name}</p>
                      <p className="text-[10px] text-slate-500">{day.meals.snack.calories} kcal</p>
                      <button
                        onClick={() => handleRemoveMeal(index, 'snack')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleAddMeal(index, 'snack')}
                      className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-center gap-2 text-slate-400 hover:border-orange-500/50 cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span className="text-xs font-semibold">Add Recipe</span>
                    </div>
                  )}
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
              <div style={{ backgroundColor: '#f27f0d', width: `${macroBalance.protein}%` }} className="h-full"></div>
              <div style={{ backgroundColor: '#f27f0d', opacity: 0.6, width: `${macroBalance.fat}%` }} className="h-full border-l border-white dark:border-slate-900"></div>
              <div style={{ backgroundColor: '#f27f0d', opacity: 0.3, width: `${macroBalance.carbs}%` }} className="h-full border-l border-white dark:border-slate-900"></div>
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

      {/* Recipe Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">
                Select Recipe for {selectedDay !== null ? plannedDays[selectedDay].name : ''} - {selectedMealType}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {isLoadingRecipes ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-500 dark:text-slate-400">Loading recipes...</div>
              </div>
            ) : recipes.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-500 dark:text-slate-400">No recipes found</div>
              </div>
            ) : (
              <div className="overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipes
                    .filter((recipe: Recipe) =>
                      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((recipe: Recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe)}
                        className="text-left p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all"
                      >
                        <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded mb-2 overflow-hidden">
                          <img
                            src={recipe.image || 'https://via.placeholder.com/300'}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{recipe.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{recipe.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>{recipe.prepTime || 0} mins</span>
                          <span className="material-symbols-outlined text-[16px] ml-2">local_fire_department</span>
                          <span>{Math.round(recipe.nutrition?.totalCalories || 0)} kcal</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMealPlannerPage;
