'use client';

import { useState } from 'react';
import { addCategory } from '@/app/actions/transactions';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Tag, Sparkles } from 'lucide-react';

export default function CategoryForm() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: '✨',
        type: 'expense' as 'income' | 'expense'
    });

    const commonEmojis = [
        '🍔', '🍕', '☕', '🛒', '🏠', '🚗', '🚌', '✈️',
        '🏥', '💊', '🎬', '🎮', '🎾', '🏋️‍♂️', '👕', '🐶',
        '🔌', '📶', '📚', '🎒', '🎁', '💰', '📉', '💵',
        '💳', '🛠️', '🏗️', '👨‍👩‍👧‍👦', '🐾', '🛡️', '💼', '✨'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addCategory(formData.name, formData.icon, formData.type);
            setFormData({ ...formData, name: '', icon: '✨' });
            setShow(false);
        } catch (error) {
            alert('Error al crear la categoría. Asegúrate de que no exista ya.');
        } finally {
            setLoading(false);
        }
    };

    if (!show) {
        return (
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShow(true)}
                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-white/5 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group"
            >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Nueva Categoría
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-5 relative overflow-hidden"
        >
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                <Tag size={100} />
            </div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Tag size={12} />
                    </div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Nueva Categoría</h4>
                </div>
                <button
                    onClick={() => setShow(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 relative">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative z-10 ${formData.type === 'expense' ? 'text-white' : 'text-slate-500'}`}
                    >
                        Gasto
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative z-10 ${formData.type === 'income' ? 'text-white' : 'text-slate-500'}`}
                    >
                        Ingreso
                    </button>
                    <motion.div
                        initial={false}
                        animate={{ x: formData.type === 'expense' ? 0 : '100%' }}
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg ${formData.type === 'expense' ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] uppercase font-black text-slate-500 tracking-[0.2em] ml-1">Seleccionar Icono</label>
                    <div className="grid grid-cols-8 gap-1 p-3 bg-black/20 rounded-2xl border border-white/5 overflow-y-auto max-h-[120px] scrollbar-hide">
                        {commonEmojis.map(emoji => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon: emoji })}
                                className={`text-lg p-1 hover:bg-white/10 rounded-lg transition-all ${formData.icon === emoji ? 'bg-white/20 scale-110 shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] uppercase font-black text-slate-500 tracking-[0.2em] ml-1">Nombre</label>
                    <input
                        required
                        type="text"
                        placeholder="Ej: Gimnasio, Mascotas..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                >
                    {loading ? 'Creando...' : 'Crear Categoría'}
                </button>
            </form>
        </motion.div>
    );
}


