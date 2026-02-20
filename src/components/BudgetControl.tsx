'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, AlertCircle, CheckCircle2, Sliders, Save, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateCategoryBudget } from '@/app/actions/transactions';

interface Category {
    id: string;
    name: string;
    icon: string;
    type: string;
    budget: number;
}

interface Transaction {
    amount: number;
    category_id: string;
    type: string;
}

export default function BudgetControl({ categories, transactions }: { categories: Category[], transactions: any[] }) {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Default dates for label (cloned from DateRangeSelector logic for UI consistency)
    const getDefaultCycle = () => {
        const now = new Date();
        if (now.getDate() >= 23) {
            return `${new Date(now.getFullYear(), now.getMonth(), 23).toLocaleDateString()} al ${new Date(now.getFullYear(), now.getMonth() + 1, 22).toLocaleDateString()}`;
        }
        return `${new Date(now.getFullYear(), now.getMonth() - 1, 23).toLocaleDateString()} al ${new Date(now.getFullYear(), now.getMonth(), 22).toLocaleDateString()}`;
    };

    const periodLabel = from && to
        ? `${new Date(from + 'T12:00:00').toLocaleDateString()} al ${new Date(to + 'T12:00:00').toLocaleDateString()}`
        : getDefaultCycle();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempBudget, setTempBudget] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const expenseCategories = categories.filter(c => c.type === 'expense');

    // Calculate spending per category
    const spendingByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc: any, t: any) => {
            const id = t.category_id;
            acc[id] = (acc[id] || 0) + Number(t.amount);
            return acc;
        }, {});

    const handleSave = async (id: string) => {
        setLoading(true);
        try {
            await updateCategoryBudget(id, parseFloat(tempBudget) || 0);
            setEditingId(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Control de Presupuestos</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        Periodo: <span className="text-blue-400">{periodLabel}</span>
                    </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                    <Target size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expenseCategories.map((cat, index) => {
                    const spent = spendingByCategory[cat.id] || 0;
                    const budget = cat.budget || 0;
                    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                    const isOver = budget > 0 && spent > budget;
                    const remaining = budget - spent;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={cat.id}
                            className={`glass p-6 rounded-[32px] border transition-all ${isOver ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl shadow-inner">
                                        {cat.icon || '📦'}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{cat.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            {isOver ? 'Límite excedido' : budget > 0 ? 'En presupuesto' : 'Sin presupuesto'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingId(cat.id);
                                        setTempBudget(budget.toString());
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors"
                                >
                                    <Sliders size={16} />
                                </button>
                            </div>

                            {editingId === cat.id ? (
                                <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-right-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black">$</span>
                                        <input
                                            autoFocus
                                            type="number"
                                            value={tempBudget}
                                            onChange={(e) => setTempBudget(e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave(cat.id)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg text-white font-black tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSave(cat.id)}
                                        disabled={loading}
                                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Gasto / Límite</span>
                                            <span className="text-2xl font-black text-white">
                                                ${spent.toLocaleString()}
                                                <span className="text-slate-500 text-xs font-bold ml-2">/ ${budget.toLocaleString()}</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isOver ? 'bg-rose-500/10 text-rose-400' : percentage > 80 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`absolute inset-y-0 left-0 rounded-full ${isOver ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                                } shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em]">
                                        <span className="text-slate-500">Consumido</span>
                                        <span className={isOver ? 'text-rose-400' : 'text-slate-400'}>
                                            {isOver
                                                ? `Excedido por $${Math.abs(remaining).toLocaleString()}`
                                                : budget > 0
                                                    ? `Disponible $${remaining.toLocaleString()}`
                                                    : 'Límite no definido'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {expenseCategories.length === 0 && (
                <div className="glass p-12 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-white/5 bg-transparent">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white">No hay categorías de gastos</h4>
                        <p className="text-slate-500 text-sm">Crea algunas categorías primero para empezar a presupuestar.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
