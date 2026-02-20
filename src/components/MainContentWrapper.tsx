'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Layout, Target } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AIReportSection from '@/components/AIReportSection';
import BudgetControl from '@/components/BudgetControl';

export default function MainContentWrapper({ data, categories, monthlyStats }: { data: any, categories: any[], monthlyStats: any[] }) {
    const [activeTab, setActiveTab] = useState<'activity' | 'metrics' | 'budgets'>('activity');

    return (
        <div className="space-y-8">
            {/* Tab Switcher - Now Responsive for Mobile (Sticky Bottom) or Desktop (Top) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:relative md:bottom-0 md:left-0 md:translate-x-0 w-[calc(100%-48px)] md:w-fit">
                <div className="flex p-1.5 bg-[#0a0a1a]/80 backdrop-blur-3xl rounded-[28px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full md:w-fit">
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-6 py-3 md:py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'activity'
                            ? 'text-white'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {activeTab === 'activity' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Activity size={14} className="relative z-10" />
                        <span className="relative z-10">Actividad</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('metrics')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-6 py-3 md:py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'metrics'
                            ? 'text-white'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {activeTab === 'metrics' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <BarChart3 size={14} className="relative z-10" />
                        <span className="relative z-10">Métricas</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('budgets')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-6 py-3 md:py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'budgets'
                            ? 'text-white'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {activeTab === 'budgets' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Target size={14} className="relative z-10" />
                        <span className="relative z-10">Presupuestos</span>
                    </button>
                </div>
            </div>

            {/* Conditional Content with Animation */}
            <div className="min-h-[600px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {activeTab === 'activity' ? (
                            <Dashboard data={data} categories={categories} />
                        ) : activeTab === 'metrics' ? (
                            <div className="space-y-16">
                                <AnalyticsDashboard data={data} monthlyStats={monthlyStats} />
                                <div className="border-t border-white/5 pt-16">
                                    <AIReportSection data={data} />
                                </div>
                            </div>
                        ) : (
                            <BudgetControl categories={categories} transactions={data.transactions} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

