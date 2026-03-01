'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Server, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { isLoading: authLoading } = useAuth();

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // Auto-login may happen depending on Supabase settings (Confirm Email enabled).
            // We will refresh routing logic.
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 2000);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 mb-4">
                        <Server className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Create Account</h1>
                    <p className="text-sm text-muted-foreground mt-1 text-center">
                        Start managing your server builds today
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading || success}
                    className="w-full flex items-center justify-center gap-2 py-3 mb-6 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Or continue with email</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                        >
                            Account created successfully! Redirecting...
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl text-white text-sm font-semibold transition-all shadow-lg",
                            (loading || success)
                                ? "bg-emerald-600/50 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        )}
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account?{' '}
                    <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
