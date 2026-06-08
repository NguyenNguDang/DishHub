import React from 'react';

export interface Ingredient {
    name: string;
    quantity: string | number;
    unit: string;
    note?: string;
}

interface Props{
    ingredients: Ingredient[];
    onChange: (index: number, field: string, value: string) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
}

export const IngredientList: React.FC<Props> = ({ ingredients, onChange, onRemove, onAdd }) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Nguyên liệu
            </label>
            {ingredients.length === 0 && (
                <p className="text-xs text-slate-500 mb-2">Chưa có nguyên liệu</p>
            )}

            {ingredients.map((ing, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start mb-2">
                    <input
                        type="text"
                        value={ing?.name || ''}
                        onChange={(e) => onChange(idx, 'name', e.target.value)}
                        placeholder="Tên nguyên liệu"
                        className="col-span-5 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        type="text"
                        value={ing?.quantity ?? ''}
                        onChange={(e) => onChange(idx, 'quantity', e.target.value)}
                        placeholder="Số lượng"
                        className="col-span-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        type="text"
                        value={ing?.unit || ''}
                        onChange={(e) => onChange(idx, 'unit', e.target.value)}
                        placeholder="Đơn vị"
                        className="col-span-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        type="text"
                        value={ing?.note || ''}
                        onChange={(e) => onChange(idx, 'note', e.target.value)}
                        placeholder="Ghi chú"
                        className="col-span-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <button
                        type="button"
                        onClick={() => onRemove(idx)}
                        className="col-span-1 bg-red-500 text-white rounded-lg px-2 py-2 text-sm hover:bg-red-600"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                >
                    + Thêm nguyên liệu
                </button>
            </div>
        </div>
    );
};