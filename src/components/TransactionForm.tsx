'use client';

import { useState } from 'react';
import { addTransaction } from '@/app/actions/transactions';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, CreditCard, Calendar, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TransactionForm() {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        type: 'expense' as 'income' | 'expense',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addTransaction({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setFormData({ ...formData, amount: '', description: '' });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Error al guardar la transacción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-2xl space-y-5 relative overflow-hidden group text-center md:text-left">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Sparkles size={80} />
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Plus size={14} />
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Nuevo Registro</h3>
                </div>

                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 relative">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all relative z-10 ${formData.type === 'expense' ? 'text-white' : 'text-slate-500'}`}
                    >
                        <Minus size={12} /> Gasto
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all relative z-10 ${formData.type === 'income' ? 'text-white' : 'text-slate-500'}`}
                    >
                        <Plus size={12} /> Ingreso
                    </button>
                    <motion.div
                        initial={false}
                        animate={{ x: formData.type === 'expense' ? 0 : '100%' }}
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl shadow-xl ${formData.type === 'expense' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}
                    />
                </div>

                <div className="space-y-3">
                    <div className="relative group/field">
                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/field:text-blue-400 transition-colors" size={16} />
                        <input
                            required
                            type="text"
                            placeholder="Descripción"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative group/field min-w-0">
                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/field:text-blue-400 transition-colors" size={14} />
                            <input
                                required
                                type="number"
                                step="0.01"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-3 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-black min-w-0"
                            />
                        </div>
                        <div className="relative group/field min-w-0">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/field:text-blue-400 transition-colors" size={14} />
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-1 py-3.5 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all [color-scheme:dark] font-bold min-w-0"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="relative z-10 uppercase tracking-widest text-[9px]">Analizando...</span>
                        </>
                    ) : (
                        <>
                            <Plus size={16} className="relative z-10" />
                            <span className="relative z-10 uppercase tracking-widest text-[9px]">Guardar Movimiento</span>
                        </>
                    )}
                </button>
            </form>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none"
                    >
                        <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                            <CheckCircle2 size={14} /> Transacción Guardada
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

