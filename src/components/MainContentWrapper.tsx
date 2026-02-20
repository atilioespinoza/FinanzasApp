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
            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 w-fit shadow-2xl">
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'activity'
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    {activeTab === 'activity' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <Activity size={14} className="relative z-10" />
                    <span className="relative z-10">Actividad</span>
                </button>
                <button
                    onClick={() => setActiveTab('metrics')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'metrics'
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    {activeTab === 'metrics' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <BarChart3 size={14} className="relative z-10" />
                    <span className="relative z-10">Métricas</span>
                </button>
                <button
                    onClick={() => setActiveTab('budgets')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'budgets'
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    {activeTab === 'budgets' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <Target size={14} className="relative z-10" />
                    <span className="relative z-10">Presupuestos</span>
                </button>
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

