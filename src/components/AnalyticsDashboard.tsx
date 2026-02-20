'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PieChart as PieIcon, Activity, Percent, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsDashboard({ data, monthlyStats }: { data: any, monthlyStats: any[] }) {
    const { transactions, income, expenses } = data;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatNumber = (num: number) => {
        if (!mounted) return num.toFixed(0).toString();
        return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        if (!mounted) return dateStr;
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    };

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // 1. Process data for Pie Chart
    const categoryData = transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((acc: any, t: any) => {
            const catName = t.categories?.name || 'Otros';
            const existing = acc.find((item: any) => item.name === catName);
            if (existing) {
                existing.value += Number(t.amount);
            } else {
                acc.push({ name: catName, value: Number(t.amount) });
            }
            return acc;
        }, []);

    // 1b. Process data for Drill-down
    const drillDownData = selectedCategory
        ? transactions
            .filter((t: any) => t.type === 'expense' && (t.categories?.name || 'Otros') === selectedCategory)
            .reduce((acc: any, t: any) => {
                const desc = t.description.trim().toUpperCase();
                const existing = acc.find((item: any) => item.name === desc);
                if (existing) {
                    existing.value += Number(t.amount);
                } else {
                    acc.push({ name: desc, value: Number(t.amount) });
                }
                return acc;
            }, []).sort((a: any, b: any) => b.value - a.value)
        : [];

    // 2. Process data for Line Chart
    const dailyData = transactions.reduce((acc: any, t: any) => {
        const date = t.date;
        const existing = acc.find((item: any) => item.date === date);
        if (existing) {
            if (t.type === 'income') existing.income += Number(t.amount);
            else existing.expenses += Number(t.amount);
        } else {
            acc.push({
                date,
                income: t.type === 'income' ? Number(t.amount) : 0,
                expenses: t.type === 'expense' ? Number(t.amount) : 0
            });
        }
        return acc;
    }, []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#2dd4bf', '#fb7185', '#94a3b8'];

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
        return val.toString();
    };

    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;
    const activePieData = selectedCategory ? drillDownData : categoryData;

    const lastMonth = monthlyStats[monthlyStats.length - 1];
    const prevMonth = monthlyStats[monthlyStats.length - 2];
    const variation = prevMonth && prevMonth.expenses > 0
        ? ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(1)
        : null;

    return (
        <div className="space-y-12">
            {/* Extended Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-[32px] flex flex-col relative overflow-hidden group"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                        <Percent size={18} />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tasa de Ahorro</p>
                    <h3 className="text-3xl font-black text-white leading-tight">{savingsRate}%</h3>
                    <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Percent size={80} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-[32px] flex flex-col relative overflow-hidden group"
                >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 text-rose-400">
                        <Activity size={18} />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Gasto Prom. Diario</p>
                    <h3 className="text-3xl font-black text-white leading-tight">
                        ${formatNumber(Math.round(expenses / (dailyData.length || 1)))}
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-[32px] flex flex-col relative overflow-hidden group"
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${Number(variation) <= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {Number(variation) <= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">vs Ciclo Anterior</p>
                    <h3 className="text-3xl font-black text-white leading-tight">
                        {variation ? `${variation}%` : '---'}
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-[32px] flex flex-col relative overflow-hidden group"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                        <ArrowUpRight size={18} />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Categoría Top</p>
                    <h3 className="text-2xl font-black text-white leading-tight truncate">
                        {categoryData.length > 0 ? categoryData.sort((a: any, b: any) => b.value - a.value)[0].name : 'N/A'}
                    </h3>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Evolution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-[40px] shadow-2xl min-h-[400px] flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Evolución Mensual</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Comparativa por Ciclos (23 al 23)</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthlyStats}
                                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                barGap={8}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingBottom: '20px',
                                        fontSize: '9px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}
                                />
                                <Bar dataKey="income" fill="url(#colorIncome)" radius={[4, 4, 0, 0]} name="Ingresos" barSize={20} />
                                <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[4, 4, 0, 0]} name="Gastos" barSize={20} />
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Cash Flow (Daily) Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-[40px] shadow-2xl min-h-[400px] flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Flujo de Caja Diario</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Detalle del periodo seleccionado</p>
                        </div>
                        <div className="flex gap-6 text-[10px] uppercase font-black tracking-[0.15em]">
                            <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Ingresos</span>
                            <span className="flex items-center gap-2 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span> Gastos</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dailyData}
                                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                barGap={4}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatDate}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingBottom: '20px',
                                        fontSize: '9px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}
                                />
                                <Bar dataKey="income" fill="url(#colorIncome)" radius={[3, 3, 0, 0]} name="Ingresos" barSize={10} />
                                <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[3, 3, 0, 0]} name="Gastos" barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Distribution Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row gap-12 items-center"
                >
                    <div className="w-full md:w-1/2 h-[350px] relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                    {selectedCategory ? `Detalle: ${selectedCategory}` : 'Distribución'}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Análisis por Categoría</p>
                            </div>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="flex items-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] uppercase font-black text-blue-400 hover:text-white transition-all border border-white/5 active:scale-95"
                                >
                                    <ArrowLeft size={12} /> Volver
                                </button>
                            )}
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={activePieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={selectedCategory ? 4 : 10}
                                    dataKey="value"
                                    stroke="none"
                                    onClick={(data) => !selectedCategory && setSelectedCategory(data.name)}
                                    className="cursor-pointer outline-none"
                                >
                                    {activePieData.map((entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={selectedCategory ? '#3b82f6' : COLORS[index % COLORS.length]}
                                            fillOpacity={selectedCategory ? (1 - index * 0.15) : 0.8}
                                            className="hover:opacity-100 transition-opacity cursor-pointer outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '20px', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full md:w-1/2 h-full max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {activePieData.sort((a: any, b: any) => b.value - a.value).map((item: any, i: number) => (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={item.name}
                                onClick={() => !selectedCategory && setSelectedCategory(item.name)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${selectedCategory
                                    ? 'bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10'
                                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <div
                                    className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                                    style={{
                                        color: selectedCategory ? '#3b82f6' : COLORS[activePieData.indexOf(item) % COLORS.length],
                                        backgroundColor: 'currentColor',
                                        opacity: selectedCategory ? (1 - i * 0.15) : 1
                                    }}
                                ></div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[11px] text-white font-black uppercase tracking-tight truncate group-hover:text-blue-400 transition-colors">{item.name}</p>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                        {((item.value / (selectedCategory ? drillDownData.reduce((a: any, b: any) => a + b.value, 0) : expenses)) * 100).toFixed(1)}% del total
                                    </p>
                                </div>
                                <span className="text-sm font-black text-white tracking-tight">${formatNumber(item.value)}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
