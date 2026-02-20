'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, RefreshCcw, LayoutGrid, ArrowRight } from 'lucide-react';

export default function DateRangeSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default range: From 23rd of previous month to 23rd of current month
    const getDefaultDates = () => {
        const now = new Date();
        let fromDate, toDate;

        if (now.getDate() >= 23) {
            fromDate = new Date(now.getFullYear(), now.getMonth(), 23);
            toDate = new Date(now.getFullYear(), now.getMonth() + 1, 22);
        } else {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 23);
            toDate = new Date(now.getFullYear(), now.getMonth(), 22);
        }

        return {
            from: fromDate.toISOString().split('T')[0],
            to: toDate.toISOString().split('T')[0]
        };
    };

    const defaultRange = getDefaultDates();
    const [range, setRange] = useState({
        from: searchParams.get('from') || defaultRange.from,
        to: searchParams.get('to') || defaultRange.to
    });

    const updateRange = (newRange: { from: string, to: string }) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', newRange.from);
        params.set('to', newRange.to);
        params.delete('month');
        params.delete('year');
        router.push(`/?${params.toString()}`);
    };

    const setPreset = (type: 'current_cycle' | 'this_month') => {
        let newRange;
        const now = new Date();

        if (type === 'current_cycle') {
            newRange = getDefaultDates();
        } else {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            newRange = {
                from: firstDay.toISOString().split('T')[0],
                to: lastDay.toISOString().split('T')[0]
            };
        }

        setRange(newRange);
        updateRange(newRange);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-5 items-center glass p-3 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex gap-2 relative z-10">
                <button
                    onClick={() => setPreset('current_cycle')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${searchParams.get('from') === defaultRange.from
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <RefreshCcw size={12} />
                    Mi Ciclo (23-23)
                </button>
                <button
                    onClick={() => setPreset('this_month')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${searchParams.get('from') !== defaultRange.from && searchParams.get('from') === new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <LayoutGrid size={12} />
                    Mes Calendario
                </button>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/10 relative z-10"></div>

            <div className="flex gap-4 items-center relative z-10">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Desde</span>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={12} />
                        <input
                            type="date"
                            value={range.from}
                            onChange={(e) => {
                                const newRange = { ...range, from: e.target.value };
                                setRange(newRange);
                                updateRange(newRange);
                            }}
                            className="bg-black/40 text-white text-[10px] font-black rounded-xl pl-9 pr-3 py-2 border border-white/5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase [color-scheme:dark]"
                        />
                    </div>
                </div>

                <ArrowRight className="text-slate-600 shrink-0 mt-4" size={14} />

                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Hasta</span>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={12} />
                        <input
                            type="date"
                            value={range.to}
                            onChange={(e) => {
                                const newRange = { ...range, to: e.target.value };
                                setRange(newRange);
                                updateRange(newRange);
                            }}
                            className="bg-black/40 text-white text-[10px] font-black rounded-xl pl-9 pr-3 py-2 border border-white/5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase [color-scheme:dark]"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

