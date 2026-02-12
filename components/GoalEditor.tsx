'use client';

import { useState } from 'react';
import { Settings, Save, X, Target } from 'lucide-react';
import { supabase, Goal } from '@/lib/supabase';

export function GoalEditor({ goal, onUpdate }: { goal: Goal | null, onUpdate: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        target_amount: goal?.target_amount || 300000,
        target_date: goal?.target_date?.slice(0, 10) || '2027-12-01'
    });

    const handleSave = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('goals')
            .upsert({
                id: goal?.id || undefined,
                ...formData,
                user_id: user?.id
            });

        if (!error) {
            setIsEditing(false);
            onUpdate();
        }
        setLoading(false);
    };

    return (
        <>
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                <Settings size={20} />
                <span className="hidden sm:inline">Ajustar Meta</span>
            </button>

            {isEditing && (
                <div className="dialog-overlay !fixed !inset-0 !m-0 !p-4">
                    <div className="dialog-content !m-auto shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Target className="text-indigo-400" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Configuración</h3>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-white transition-colors p-2">
                                <X size={28} />
                            </button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Monto Objetivo ($)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        className="input-field !pl-10 text-lg"
                                        value={formData.target_amount}
                                        onChange={e => setFormData({ ...formData, target_amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Fecha Límite</label>
                                <input
                                    type="date"
                                    className="input-field text-lg"
                                    value={formData.target_date}
                                    onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                                />
                            </div>
                            <button className="btn-primary w-full py-5 text-lg mt-4 shadow-xl shadow-indigo-500/20" disabled={loading} onClick={handleSave}>
                                <Save size={22} />
                                {loading ? 'Guardando...' : 'Actualizar Objetivo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
