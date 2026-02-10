'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, Category, Balance } from '@/lib/supabase';

const CATEGORIES: Category[] = ['Efectivo', 'Banco', 'Cripto', 'DolarApp', 'Broker'];

export function BalanceManager({ initialBalances, onUpdate }: { initialBalances: Balance[], onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newBalance, setNewBalance] = useState({
        month: new Date().toISOString().slice(0, 7),
        category: CATEGORIES[0],
        amount: ''
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBalance.amount) return;

        setLoading(true);
        const { error } = await supabase
            .from('balances')
            .upsert({
                month: `${newBalance.month}-01`,
                category: newBalance.category,
                amount: parseFloat(newBalance.amount)
            }, { onConflict: 'month,category' });

        if (!error) {
            setNewBalance({ ...newBalance, amount: '' });
            onUpdate();
            setIsDialogOpen(false);
        }
        setLoading(false);
    };

    const grouped = initialBalances.reduce((acc, b) => {
        const m = b.month.slice(0, 7);
        if (!acc[m]) acc[m] = {};
        acc[m][b.category] = b;
        return acc;
    }, {} as Record<string, Record<string, Balance>>);

    const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    const monthsToShow = isExpanded ? sortedMonths : sortedMonths.slice(0, 1);

    return (
        <div className="mt-40">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Registro de Balances</h2>
                    <p className="text-zinc-400">Control detallado de tus activos mensuales</p>
                </div>
                <button className="btn-primary shadow-indigo-500/20" onClick={() => setIsDialogOpen(true)}>
                    <Plus size={22} />
                    Añadir Balance
                </button>
            </div>

            {isDialogOpen && (
                <div className="dialog-overlay !fixed !inset-0 !m-0 !p-4">
                    <div className="dialog-content !m-auto shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Plus className="text-indigo-400" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Nuevo Balance</h3>
                            </div>
                            <button onClick={() => setIsDialogOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-2">
                                <X size={28} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-8">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Mes de Referencia</label>
                                <input
                                    type="month"
                                    className="input-field text-lg"
                                    value={newBalance.month}
                                    onChange={e => setNewBalance({ ...newBalance, month: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Categoría del Fondo</label>
                                <select
                                    className="input-field text-lg appearance-none bg-zinc-800"
                                    value={newBalance.category}
                                    onChange={e => setNewBalance({ ...newBalance, category: e.target.value as Category })}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Monto Actual ($)</label>
                                <input
                                    type="number"
                                    className="input-field text-lg"
                                    placeholder="0.00"
                                    value={newBalance.amount}
                                    onChange={e => setNewBalance({ ...newBalance, amount: e.target.value })}
                                />
                            </div>
                            <button className="btn-primary w-full py-5 text-lg mt-4 shadow-xl shadow-indigo-500/20" disabled={loading} type="submit">
                                {loading ? 'Guardando...' : 'Confirmar Registro'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-6 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Periodo</th>
                                {CATEGORIES.map(c => (
                                    <th key={c} className="px-6 py-6 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">{c}</th>
                                ))}
                                <th className="px-6 py-6 text-right text-xs font-bold text-zinc-500 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-zinc-500 uppercase tracking-widest">Diferencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {monthsToShow.map((month) => {
                                const actualIndex = sortedMonths.indexOf(month);
                                const monthData = grouped[month];
                                const total = Object.values(monthData).reduce((sum, b) => sum + b.amount, 0);
                                const nextMonth = sortedMonths[actualIndex + 1];
                                const prevTotal = nextMonth
                                    ? Object.values(grouped[nextMonth]).reduce((sum, b) => sum + b.amount, 0)
                                    : 0;
                                const delta = actualIndex < sortedMonths.length - 1 ? total - prevTotal : 0;

                                return (
                                    <tr key={month} className="group hover:bg-white/[0.01] transition-colors duration-200">
                                        <td className="px-8 py-8 font-bold text-white text-lg capitalize">
                                            {new Date(month + '-01').toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                                        </td>
                                        {CATEGORIES.map(c => (
                                            <td key={c} className="px-6 py-8">
                                                <span className="text-zinc-400 font-medium">
                                                    {monthData[c] ? `$${monthData[c].amount.toLocaleString()}` : '—'}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="px-6 py-8 text-right font-black text-white text-xl">
                                            ${total.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-8 text-right font-bold">
                                            {actualIndex < sortedMonths.length - 1 ? (
                                                <div className={`flex items-center justify-end gap-2 ${delta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {delta >= 0 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    ${Math.abs(delta).toLocaleString()}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {sortedMonths.length > 1 && (
                <div className="mt-12 flex justify-center">
                    <button
                        className="btn-secondary px-10 py-4 rounded-full"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <>Ver menos balances <ChevronUp size={20} /></>
                        ) : (
                            <>Ver historial completo ({sortedMonths.length}) <ChevronDown size={20} /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
