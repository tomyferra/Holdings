'use client';

import { TrendingUp, Target, Calendar, DollarSign, Info } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Balance } from '@/lib/supabase';
import { useMemo } from 'react';

interface DashboardProps {
    balances: Balance[];
    targetAmount: number;
    targetDate: string;
}

export function Dashboard({ balances, targetAmount, targetDate }: DashboardProps) {
    // Aggregate totals by month
    const chartData = useMemo(() => {
        const monthlyTotals = balances.reduce((acc, b) => {
            const rawMonth = (b.month && typeof b.month === 'string') ? b.month : '2025-01-01';
            const m = rawMonth.slice(0, 7);
            if (!acc[m]) acc[m] = 0;
            acc[m] += Number(b.amount) || 0;
            return acc;
        }, {} as Record<string, number>);

        return Object.keys(monthlyTotals)
            .sort()
            .map(month => ({
                month,
                total: monthlyTotals[month]
            }));
    }, [balances]);

    const currentTotal = chartData.length > 0 ? chartData[chartData.length - 1].total : 0;
    const missing = Math.max(0, targetAmount - currentTotal);

    const now = new Date();
    const target = new Date(targetDate);
    const monthsRemaining = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    const monthlyNeeded = monthsRemaining > 0 ? missing / monthsRemaining : 0;

    return (
        <div className="space-y-12 w-full">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <div className="glass-card flex items-center gap-6 p-6 w-full">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl">
                        <TrendingUp className="text-emerald-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Total Ahorrado</p>
                        <h3 className="text-2xl font-black text-white">${currentTotal.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-6 p-6 w-full">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl">
                        <Target className="text-indigo-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Faltante</p>
                        <h3 className="text-2xl font-black text-white">${missing.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-6 p-6 w-full">
                    <div className="p-4 bg-amber-500/10 rounded-2xl">
                        <DollarSign className="text-amber-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Ahorro Mensual</p>
                        <h3 className="text-2xl font-black text-emerald-500">${monthlyNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-6 p-6 w-full">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl">
                        <Calendar className="text-indigo-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Fecha Límite</p>
                        <h3 className="text-2xl font-black text-white uppercase">{new Date(targetDate).toLocaleDateString('es', { month: 'short', year: 'numeric' })}</h3>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="glass-card p-10 w-full min-h-[550px] flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Evolución de Ahorros</h2>
                        <p className="text-zinc-400 mt-1">Comparativa vs Meta de ${(targetAmount / 1000)}k</p>
                    </div>
                    <div className="flex gap-6 text-xs font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            <span className="text-zinc-300">Acumulado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-zinc-300">Meta</span>
                        </div>
                    </div>
                </div>

                {/* FIXED HEIGHT CONTAINER FOR THE CHART */}
                <div className="w-full h-[400px] mt-2 relative z-10">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={11}
                                    tickMargin={12}
                                    tickFormatter={(val) => {
                                        try {
                                            return new Date(val + '-01T00:00:00').toLocaleDateString('es', { month: 'short', year: 'numeric' }).toUpperCase();
                                        } catch {
                                            return val;
                                        }
                                    }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={11}
                                    tickFormatter={(val) => `$${(val / 1000)}k`}
                                    domain={[0, (dataMax: number) => Math.max(dataMax, targetAmount) * 1.2]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                                    }}
                                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Total']}
                                />
                                <ReferenceLine
                                    y={targetAmount}
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    strokeDasharray="8 8"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                    isAnimationActive={false}
                                    dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#f97316', strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <Info className="text-zinc-600 mb-4" size={40} />
                            <p className="text-zinc-400 font-medium">No hay datos históricos aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
