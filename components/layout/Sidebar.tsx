'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    PlusCircle,
    Server,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/create', label: 'New Project', icon: PlusCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const NavContent = () => (
        <>
            {/* Brand */}
            <div className="flex items-center gap-3 px-3 py-4 mb-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
                    <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-foreground tracking-tight">HomeLab OS</h1>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Server Manager</p>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-border mx-3 mb-4" />

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                                isActive
                                    ? 'text-sidebar-primary-foreground bg-sidebar-primary/10'
                                    : 'text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon className={cn('w-4 h-4 relative z-10', isActive && 'text-blue-400')} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 mt-auto">
                <div className="h-px bg-border mb-4" />
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                    <ThemeToggle />
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-[240px] lg:min-h-screen bg-sidebar-background border-r border-sidebar-border fixed top-0 left-0 bottom-0 z-40">
                <NavContent />
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-sidebar-background/80 backdrop-blur-xl border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Server className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-foreground">HomeLab OS</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary hover:bg-accent transition-colors border border-border"
                    >
                        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-[260px] bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col"
                        >
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
