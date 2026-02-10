'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, Balance, Goal } from '@/lib/supabase';
import { Dashboard } from '@/components/Dashboard';
import { BalanceManager } from '@/components/BalanceManager';
import { GoalEditor } from '@/components/GoalEditor';
import { Wallet, Sparkles } from 'lucide-react';

export default function Home() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data: bData } = await supabase
      .from('balances')
      .select('*')
      .order('month', { ascending: false });

    const { data: gData } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (bData) setBalances(bData);
    if (gData && gData.length > 0) setGoal(gData[0]);
    else {
      setGoal({
        id: '',
        target_amount: 300000,
        target_date: '2027-12-01'
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && balances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
        </div>
        <p className="mt-6 text-zinc-500 font-medium tracking-widest uppercase text-xs">Calculando ahorros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">HOLDINGS</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Camino a Casa</p>
            </div>
          </div>
          <GoalEditor goal={goal} onUpdate={fetchData} />
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        <div className="mb-12 lg:mb-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-gradient mb-4">
            Objetivo Vivienda 2027
          </h1>
          <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl leading-relaxed">
            Visualización avanzada de tus metas financieras y progreso mensual hacia tu primera casa.
          </p>
        </div>

        {goal && (
          <Dashboard
            balances={balances}
            targetAmount={goal.target_amount}
            targetDate={goal.target_date}
          />
        )}

        <BalanceManager initialBalances={balances} onUpdate={fetchData} />


      </main>
    </div>
  );
}
