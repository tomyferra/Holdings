'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Wallet, Sparkles, LogIn, Mail, Lock, Loader2, UserPlus } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push('/');
                router.refresh();
            }
        } else {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                if (data.session) {
                    router.push('/');
                    router.refresh();
                } else {
                    setError('¡Registro exitoso! Por favor verifica tu email si es necesario.');
                    setLoading(false);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 group transition-all duration-500 hover:scale-110">
                        <Wallet className="text-white group-hover:rotate-12 transition-transform duration-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-500" />
                        Holdings - Camino a Casa
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={`border text-xs font-medium p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${error.includes('exitoso')
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error.includes('exitoso') ? 'bg-emerald-500' : 'bg-red-500'
                                    }`} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-white/5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Procesando...</span>
                                </>
                            ) : mode === 'login' ? (
                                <>
                                    <LogIn size={20} />
                                    <span>Entrar</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    <span>Registrarse</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-zinc-500 text-sm">
                            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                            >
                                {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-zinc-500 text-xs">
                    Protegido por Supabase Auth & RLS
                </p>
            </div>
        </div>
    );
}
