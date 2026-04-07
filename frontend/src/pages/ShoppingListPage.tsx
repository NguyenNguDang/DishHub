import React, { useState } from 'react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
}

interface CategoryGroup {
  name: string;
  icon: string;
  items: ShoppingItem[];
}

const ShoppingListPage: React.FC = () => {
  const [currentWeek] = useState('Oct 23 — Oct 29, 2023');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed'>('all');
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    // Produce
    { id: '1', name: 'Baby Spinach', quantity: 500, unit: 'g', category: 'Produce', completed: false },
    { id: '2', name: 'Red Bell Peppers', quantity: 3, unit: 'units', category: 'Produce', completed: false },
    { id: '3', name: 'Garlic Bulbs', quantity: 2, unit: 'units', category: 'Produce', completed: true },
    { id: '4', name: 'Sweet Potatoes', quantity: 1.5, unit: 'kg', category: 'Produce', completed: false },
    { id: '5', name: 'Red Onions', quantity: 4, unit: 'units', category: 'Produce', completed: false },
    
    // Meat & Seafood
    { id: '6', name: 'Chicken Breast', quantity: 800, unit: 'g', category: 'Meat & Seafood', completed: false },
    { id: '7', name: 'Atlantic Salmon Fillets', quantity: 2, unit: 'units', category: 'Meat & Seafood', completed: false },
    { id: '8', name: 'Lean Ground Beef', quantity: 1, unit: 'lb', category: 'Meat & Seafood', completed: false },
    
    // Dairy & Eggs
    { id: '9', name: 'Organic Large Eggs', quantity: 1, unit: 'dozen', category: 'Dairy & Eggs', completed: false },
    { id: '10', name: 'Greek Yogurt', quantity: 500, unit: 'ml', category: 'Dairy & Eggs', completed: true },
    
    // Pantry
    { id: '11', name: 'Extra Virgin Olive Oil', quantity: 250, unit: 'ml', category: 'Pantry', completed: false },
    { id: '12', name: 'Quinoa', quantity: 2, unit: 'cups', category: 'Pantry', completed: false },
    { id: '13', name: 'Canned Chickpeas', quantity: 2, unit: 'tins', category: 'Pantry', completed: false },
    { id: '14', name: 'Balsamic Vinegar', quantity: 1, unit: 'btl', category: 'Pantry', completed: false },
  ]);

  const categoryIcons: Record<string, string> = {
    'Produce': 'eco',
    'Meat & Seafood': 'set_meal',
    'Dairy & Eggs': 'egg',
    'Pantry': 'inventory_2',
  };

  const toggleItem = (itemId: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const groupedItems = shoppingItems.reduce((acc, item) => {
    const existing = acc.find(g => g.name === item.category);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({
        name: item.category,
        icon: categoryIcons[item.category],
        items: [item],
      });
    }
    return acc;
  }, [] as CategoryGroup[]);

  const filteredGroups = groupedItems.map(group => ({
    ...group,
    items: activeFilter === 'completed'
      ? group.items.filter(item => item.completed)
      : group.items,
  })).filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Title and Week Selector */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2 dark:text-white">Shopping List</h1>
              <p className="text-slate-500 dark:text-slate-400">Weekly ingredients for your saved meal plan</p>
            </div>
            <div className="bg-orange-500/5 dark:bg-orange-500/10 p-4 rounded-xl border border-orange-500/10 flex flex-col gap-2 min-w-[320px]">
              <label className="text-xs font-bold uppercase tracking-wider text-orange-500">Select Week</label>
              <div className="flex items-center justify-between gap-4">
                <button className="p-1 hover:text-orange-500 transition-colors text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{currentWeek}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">12 recipes planned</span>
                </div>
                <button className="p-1 hover:text-orange-500 transition-colors text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveFilter('all')}
              style={{ backgroundColor: activeFilter === 'all' ? '#f27f0d' : undefined }}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">list_alt</span>
              All Items
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeFilter === 'completed'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Completed
            </button>
            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-[18px] align-middle mr-1" style={{ display: 'inline' }}>share</span>
              Share List
            </button>
            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-[18px] align-middle mr-1" style={{ display: 'inline' }}>print</span>
              Print
            </button>
          </div>

          {/* Shopping List Sections */}
          <div className="space-y-8">
            {filteredGroups.map((group) => (
              <section key={group.name}>
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-orange-500">{group.icon}</span>
                  <h3 className="text-lg font-bold dark:text-white">{group.name}</h3>
                  <span className="ml-auto text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                    {group.items.length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 accent-orange-500"
                        style={item.completed ? { opacity: 0.5 } : {}}
                      />
                      <span
                        className={`ml-4 font-medium flex-grow ${
                          item.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          item.completed
                            ? 'text-slate-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <span
                        className={`ml-1 text-sm uppercase ${
                          item.completed
                            ? 'text-slate-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.unit}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-10 px-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 bg-slate-400 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">restaurant_menu</span>
            </div>
            <span className="font-bold text-slate-500 dark:text-slate-400">DishHub</span>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-slate-500 hover:text-orange-500 transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-slate-500 hover:text-orange-500 transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-slate-500 hover:text-orange-500 transition-colors" href="#">Help Center</a>
          </div>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest">© 2024 DishHub Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Add Button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button style={{ backgroundColor: '#f27f0d' }} className="w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
};

export default ShoppingListPage;
