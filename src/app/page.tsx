import TransactionForm from '@/components/TransactionForm';
import CategoryForm from '@/components/CategoryForm';
import MainContentWrapper from '@/components/MainContentWrapper';
import DateRangeSelector from '@/components/DateRangeSelector';
import { getSummary, getCategories, getMonthlyStats } from './actions/transactions';
import { Sparkles, Database, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const from = searchParams.from;
  const to = searchParams.to;

  const data = await getSummary(from, to);
  const categories = await getCategories();
  const monthlyStats = await getMonthlyStats(true); // Default to cycle logic (23rd)

  return (
    <main className="min-h-screen bg-[#050510] text-slate-200">
      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,24px)]">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center gap-2">
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Finance Pro v2.0</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-600 tracking-tighter">
              Finanzas<span className="text-blue-500">.</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Control absoluto de tus activos con inteligencia artificial.</p>
          </div>
          <div className="flex flex-col items-end gap-5">
            <DateRangeSelector />
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5 bg-white/5 py-2 px-4 rounded-2xl shadow-xl">
                <Database size={12} /> Supabase
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/10 bg-blue-500/5 py-2 px-4 rounded-2xl shadow-xl shadow-blue-500/10">
                <Cpu size={12} /> Gemini Flash
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content: Tabs for Activity/Metrics */}
          <div className="lg:col-span-8 order-2 lg:order-1 pb-32 md:pb-0">
            <MainContentWrapper data={data} categories={categories} monthlyStats={monthlyStats} />
          </div>

          {/* Sidebar: New Transaction */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-12 space-y-10">
              <div className="space-y-6">
                <TransactionForm />

                <div className="glass p-5 rounded-[28px] border border-blue-500/10 bg-blue-500/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Sparkles size={30} />
                  </div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-blue-400 mb-1.5">💡 Tip Inteligente</p>
                  <p className="text-[10px] leading-relaxed text-slate-300 font-medium italic">
                    "La app recordará tus descripciones para categorizar al instante. Menos clicks, más control."
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4 mb-4">Gestión</h3>
                <CategoryForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimalista */}
      <footer className="relative z-10 py-12 border-t border-white/5 mt-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
          Powered by DeepMind Agents & Gemini AI
        </p>
      </footer>
    </main>
  );
}

