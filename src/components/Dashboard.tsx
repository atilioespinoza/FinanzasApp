'use client';

import { deleteTransaction, updateTransactionCategory } from '@/app/actions/transactions';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, TrendingUp, TrendingDown, Wallet, Calendar, Tag, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ data, categories }: { data: any, categories: any[] }) {
    const { income, expenses, transactions } = data;
    const balance = income - expenses;
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatNumber = (num: number) => {
        if (!mounted) return num.toString();
        return num.toLocaleString();
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        if (!mounted) return dateStr;
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) return;

        setDeletingId(id);
        try {
            await deleteTransaction(id);
        } catch (error) {
            alert('Error al eliminar la transacción');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCategoryChange = async (transactionId: string, newCategoryId: string) => {
        setUpdatingId(transactionId);
        try {
            await updateTransactionCategory(transactionId, newCategoryId);
        } catch (error) {
            alert('Error al actualizar la categoría');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredTransactions = transactions.filter((t: any) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-blue p-6 rounded-[32px] shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <Wallet size={20} />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Balance Total</p>
                        <h2 className="text-3xl font-black text-white">${formatNumber(balance)}</h2>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-emerald p-6 rounded-[32px] shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-widest mb-1">Ingresos</p>
                        <h2 className="text-3xl font-black text-emerald-400">+${formatNumber(income)}</h2>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-rose p-6 rounded-[32px] shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
                            <TrendingDown size={20} />
                        </div>
                        <p className="text-rose-400/80 text-xs font-bold uppercase tracking-widest mb-1">Gastos</p>
                        <h2 className="text-3xl font-black text-rose-400">-${formatNumber(expenses)}</h2>
                    </div>
                </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-[32px] shadow-2xl overflow-hidden border border-white/5"
            >
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            Actividad <span className="text-blue-500 text-2xl">.</span>
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-2xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all w-48 md:w-64"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode='popLayout'>
                        {filteredTransactions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-20 text-center text-slate-500 flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                    <Search size={32} strokeWidth={1} />
                                </div>
                                <p className="font-medium">No se encontraron movimientos.</p>
                            </motion.div>
                        ) : (
                            filteredTransactions.map((t: any, index: number) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={t.id}
                                    className="p-5 hover:bg-white/5 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-3xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                                {t.categories?.icon || '✨'}
                                            </div>
                                            {updatingId === t.id && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base group-hover:text-blue-400 transition-colors uppercase tracking-tight">{t.description}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={t.category_id || ''}
                                                        onChange={(e) => handleCategoryChange(t.id, e.target.value)}
                                                        className="bg-transparent text-[10px] font-black text-slate-500 uppercase tracking-widest appearance-none cursor-pointer hover:text-blue-500 transition-colors focus:outline-none pr-4"
                                                    >
                                                        {categories.filter(cat => cat.type === t.type).map(cat => (
                                                            <option key={cat.id} value={cat.id} className="bg-[#0f172a] text-slate-200">
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" size={10} />
                                                </div>
                                                <span className="text-[10px] text-slate-600 font-bold">•</span>
                                                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <Calendar size={10} /> {formatDate(t.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className={`font-black text-xl tracking-tight ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                                                {t.type === 'income' ? '+' : '-'}${formatNumber(Number(t.amount))}
                                            </p>
                                            {t.type === 'income' && <p className="text-[8px] text-emerald-500/50 font-black uppercase tracking-[0.2em] mt-0.5">Completado</p>}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            disabled={deletingId === t.id}
                                            className="opacity-0 group-hover:opacity-100 p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
                                            title="Eliminar registro"
                                        >
                                            {deletingId === t.id ? (
                                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 size={20} />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}


