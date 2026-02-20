'use client';

import { useState } from 'react';
import { getFinancialReport } from '@/app/actions/transactions';

export default function AIReportSection({ data }: { data: any }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any>(null);

    const generateReport = async () => {
        setLoading(true);
        try {
            const result = await getFinancialReport(data);
            setReport(result);
        } catch (error) {
            alert('Error al generar el informe');
        } finally {
            setLoading(false);
        }
    };

    if (!report) {
        return (
            <div className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Asistente Financiero AI</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Genera un análisis profundo de tu comportamiento financiero con Gemini 3.0 Flash.
                    Recibe recomendaciones personalizadas para mejorar tu salud financiera.
                </p>
                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                    {loading ? 'Analizando tus datos...' : 'Generar Informe Ejecutivo'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl">
                        🛡️
                    </div>
                    <div>
                        <h4 className="text-white font-bold">{report.financialArchetype}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Tu Arquetipo Financiero</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-white">{report.healthScore}/100</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Score de Salud</p>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Resumen Ejecutivo</h4>
                <p className="text-slate-200 leading-relaxed text-sm">
                    {report.executiveSummary}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">Insights Clave</h4>
                    <ul className="space-y-3">
                        {report.keyInsights.map((insight: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="text-amber-400">✦</span> {insight}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Recomendaciones</h4>
                    <ul className="space-y-3">
                        {report.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="text-emerald-400">✔</span> {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                onClick={() => setReport(null)}
                className="w-full py-4 text-slate-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-all"
            >
                Limpiar y Volver a Analizar
            </button>
        </div>
    );
}
