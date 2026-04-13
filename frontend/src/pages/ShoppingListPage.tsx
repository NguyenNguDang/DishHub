import React, { useState } from 'react';
import { useGetShoppingList, useUpdateShoppingListItem, useShareShoppingList, useGenerateShoppingListFromWeek, useDeleteShoppingListItem, useAddShoppingListItem } from '../hooks/useShoppingListApi';
import type { ShoppingListItem } from '../types';

interface CategoryGroup {
  name: string;
  icon: string;
  items: ShoppingListItem[];
}

const ShoppingListPage: React.FC = () => {
  // ✅ Week state management
  const [weekIndex, setWeekIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed'>('all');
  const [shareEmail, setShareEmail] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'units', category: 'Pantry' });

  // ✅ Calculate week data from weekIndex (no need for state)
  const weekData = (() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekIndex * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Return ISO format for API
    const isoStart = startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD

    // Return display format
    const format = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    return {
      display: `${format(startOfWeek)} — ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`,
      iso: isoStart,
    };
  })();

  const currentWeek = weekData.display;
  const weekStartDate = weekData.iso;

  // ✅ API hooks
  const { data: shoppingList } = useGetShoppingList(weekStartDate);
  const { data: generatedShoppingList, isLoading: isGenerating } = useGenerateShoppingListFromWeek(weekStartDate);
  const updateItemMutation = useUpdateShoppingListItem();
  const addItemMutation = useAddShoppingListItem();
  const deleteItemMutation = useDeleteShoppingListItem();
  const shareListMutation = useShareShoppingList();

  // ✅ Fallback mock data khi không có API
  const mockItems: ShoppingListItem[] = [
    // Produce
    { id: '1', name: 'Baby Spinach', quantity: 500, unit: 'g', category: 'Produce', isChecked: false, addedAt: new Date() },
    { id: '2', name: 'Red Bell Peppers', quantity: 3, unit: 'units', category: 'Produce', isChecked: false, addedAt: new Date() },
    { id: '3', name: 'Garlic Bulbs', quantity: 2, unit: 'units', category: 'Produce', isChecked: true, addedAt: new Date() },
    { id: '4', name: 'Sweet Potatoes', quantity: 1.5, unit: 'kg', category: 'Produce', isChecked: false, addedAt: new Date() },
    { id: '5', name: 'Red Onions', quantity: 4, unit: 'units', category: 'Produce', isChecked: false, addedAt: new Date() },

    // Meat & Seafood
    { id: '6', name: 'Chicken Breast', quantity: 800, unit: 'g', category: 'Meat & Seafood', isChecked: false, addedAt: new Date() },
    { id: '7', name: 'Atlantic Salmon Fillets', quantity: 2, unit: 'units', category: 'Meat & Seafood', isChecked: false, addedAt: new Date() },
    { id: '8', name: 'Lean Ground Beef', quantity: 1, unit: 'lb', category: 'Meat & Seafood', isChecked: false, addedAt: new Date() },

    // Dairy & Eggs
    { id: '9', name: 'Organic Large Eggs', quantity: 1, unit: 'dozen', category: 'Dairy & Eggs', isChecked: false, addedAt: new Date() },
    { id: '10', name: 'Greek Yogurt', quantity: 500, unit: 'ml', category: 'Dairy & Eggs', isChecked: true, addedAt: new Date() },

    // Pantry
    { id: '11', name: 'Extra Virgin Olive Oil', quantity: 250, unit: 'ml', category: 'Pantry', isChecked: false, addedAt: new Date() },
    { id: '12', name: 'Quinoa', quantity: 2, unit: 'cups', category: 'Pantry', isChecked: false, addedAt: new Date() },
    { id: '13', name: 'Canned Chickpeas', quantity: 2, unit: 'tins', category: 'Pantry', isChecked: false, addedAt: new Date() },
    { id: '14', name: 'Balsamic Vinegar', quantity: 1, unit: 'btl', category: 'Pantry', isChecked: false, addedAt: new Date() },
  ];

  // ✅ Local state for optimistic updates
  const [localItems, setLocalItems] = useState<ShoppingListItem[]>([]);

  // ✅ Use generated shopping list if available, otherwise use fetched or mock
  const shoppingItems = localItems.length > 0 
    ? localItems 
    : (generatedShoppingList?.items || shoppingList?.items || mockItems);

  // ✅ Category icons mapping
  const categoryIcons: Record<string, string> = {
    'Produce': 'eco',
    'Meat & Seafood': 'set_meal',
    'Dairy & Eggs': 'egg',
    'Pantry': 'inventory_2',
  };


  // ✅ Handle week navigation
  const handlePreviousWeek = () => {
    setWeekIndex(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekIndex(prev => prev + 1);
  };

  // ✅ Handle toggle item with optimistic update
  const toggleItem = async (itemId: string) => {
    const item = shoppingItems.find(i => i.id === itemId);
    if (!item) return;

    // ✅ Optimistic update - update UI immediately
    const updatedItems = shoppingItems.map(i =>
      i.id === itemId ? { ...i, isChecked: !i.isChecked } : i
    );
    setLocalItems(updatedItems);

    // ✅ API call if shoppingList exists
    if (shoppingList) {
      try {
        await updateItemMutation.mutateAsync({
          shoppingListId: shoppingList.id,
          itemId,
          data: { isChecked: !item.isChecked }
        });
      } catch (err) {
        console.error('Failed to toggle item:', err);
        // Revert optimistic update on error
        setLocalItems(shoppingItems);
      }
    }
  };

  // ✅ Handle share
  const handleShare = async () => {
    if (!shareEmail || !shoppingList) return;

    try {
      const result = await shareListMutation.mutateAsync({
        shoppingListId: shoppingList.id,
        email: shareEmail
      });
      
      // Copy share URL to clipboard
      navigator.clipboard.writeText(result.shareUrl);
      
      // Show success message
      alert(`✓ Shared! Link copied to clipboard:\n${result.shareUrl}`);
      setShareEmail('');
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to share shopping list:', err);
      alert('Failed to share. Please check the email and try again.');
    }
  };

  // ✅ Handle print
  const handlePrint = () => {
    window.print();
  };

  // ✅ Handle delete item with optimistic update
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // ✅ Optimistic update - remove from UI immediately
    const updatedItems = shoppingItems.filter(i => i.id !== itemId);
    setLocalItems(updatedItems);

    // ✅ API call if shoppingList exists
    if (shoppingList) {
      try {
        await deleteItemMutation.mutateAsync({
          shoppingListId: shoppingList.id,
          itemId,
        });
      } catch (err) {
        console.error('Failed to delete item:', err);
        // Revert optimistic update on error
        setLocalItems(shoppingItems);
        alert('Failed to delete item');
      }
    }
  };

  // ✅ Handle add item with optimistic update
  const handleAddItem = async () => {
    if (!newItem.name) return;

    // ✅ Create new item with temporary ID
    const newItemObj: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      isChecked: false,
      addedAt: new Date(),
    };

    // ✅ Optimistic update - add to UI immediately
    const updatedItems = [...shoppingItems, newItemObj];
    setLocalItems(updatedItems);
    setNewItem({ name: '', quantity: 1, unit: 'units', category: 'Pantry' });
    setShowAddItemModal(false);

    // ✅ API call if shoppingList exists
    if (shoppingList) {
      try {
        await addItemMutation.mutateAsync({
          shoppingListId: shoppingList.id,
          data: {
            name: newItem.name,
            quantity: newItem.quantity,
            unit: newItem.unit,
            category: newItem.category,
          },
        });
      } catch (err) {
        console.error('Failed to add item:', err);
        // Revert optimistic update on error
        setLocalItems(shoppingItems);
        setNewItem({ name: newItemObj.name, quantity: newItemObj.quantity, unit: newItemObj.unit, category: newItemObj.category });
        setShowAddItemModal(true);
        alert('Failed to add item');
      }
    } else {
      alert('Item added to local list!');
    }
  };

  // ✅ Handle export to CSV
  const handleExportCSV = () => {
    if (shoppingItems.length === 0) {
      alert('No items to export');
      return;
    }

    // Create CSV header
    const headers = ['Item', 'Quantity', 'Unit', 'Category', 'Checked'];
    const csvContent = [
      headers.join(','),
      ...shoppingItems.map(item =>
        `"${item.name}",${item.quantity},"${item.unit}","${item.category}",${item.isChecked ? 'Yes' : 'No'}`
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `shopping-list-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      ? group.items.filter(item => item.isChecked)
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
                <button 
                  onClick={handlePreviousWeek}
                  className="p-1 hover:text-orange-500 transition-colors text-slate-600 dark:text-slate-400"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{currentWeek}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">12 recipes planned</span>
                </div>
                <button 
                  onClick={handleNextWeek}
                  className="p-1 hover:text-orange-500 transition-colors text-slate-600 dark:text-slate-400"
                >
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
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[18px] align-middle mr-1" style={{ display: 'inline' }}>share</span>
              Share List
            </button>
            <button
              onClick={() => !generatedShoppingList && (window.location.href = '/weekly-meal-planner')}
              disabled={isGenerating}
              style={{ backgroundColor: generatedShoppingList ? '#f27f0d' : '#ccc', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-white flex items-center gap-2 disabled:opacity-50"
              title={generatedShoppingList ? 'Shopping list generated from meal plans' : isGenerating ? 'Generating...' : 'Plan meals first to generate list'}
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              {isGenerating ? 'Generating...' : generatedShoppingList ? 'Generated' : 'Generate from Meals'}
            </button>
            <button 
              onClick={handlePrint}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[18px] align-middle mr-1" style={{ display: 'inline' }}>print</span>
              Print
            </button>
            <button 
              onClick={handleExportCSV}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[18px] align-middle mr-1" style={{ display: 'inline' }}>download</span>
              Export CSV
            </button>
            <button 
              onClick={() => setShowAddItemModal(true)}
              style={{ backgroundColor: '#f27f0d' }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-white flex items-center gap-2 hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Item
            </button>
          </div>

          {/* Shopping List Sections */}
          <div className="space-y-8">
            {isGenerating && (
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
                <span className="text-sm text-blue-700 dark:text-blue-300">Generating shopping list from meal plans...</span>
              </div>
            )}
            {generatedShoppingList && !isGenerating && (
              <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                <span className="text-sm text-green-700 dark:text-green-300">Shopping list auto-generated from your meal plans for this week!</span>
              </div>
            )}
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
                        checked={item.isChecked}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 accent-orange-500"
                        style={item.isChecked ? { opacity: 0.5 } : {}}
                      />
                      <span
                        className={`ml-4 font-medium flex-grow ${
                          item.isChecked
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          item.isChecked
                            ? 'text-slate-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <span
                        className="ml-1 text-sm uppercase text-slate-400"
                      >
                        {item.unit}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deleteItemMutation.isPending}
                        className="ml-3 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete item"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Share Shopping List</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Enter an email to share this shopping list
            </p>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={!shareEmail || shareListMutation.isPending}
                style={{ backgroundColor: shareEmail ? '#f27f0d' : '#ccc' }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shareListMutation.isPending ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Add New Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Milk, Bread, Chicken"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="1"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>units</option>
                    <option>g</option>
                    <option>kg</option>
                    <option>ml</option>
                    <option>l</option>
                    <option>cups</option>
                    <option>tbsp</option>
                    <option>tsp</option>
                    <option>lb</option>
                    <option>oz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>Produce</option>
                  <option>Meat & Seafood</option>
                  <option>Dairy & Eggs</option>
                  <option>Pantry</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.name || addItemMutation.isPending}
                style={{ backgroundColor: newItem.name ? '#f27f0d' : '#ccc' }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
