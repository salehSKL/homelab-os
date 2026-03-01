'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    description?: string;
    gradient?: string;
    index?: number;
}

export function StatCard({ title, value, icon, description, gradient = 'from-blue-500/10 to-cyan-500/10', index = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
        >
            {/* Gradient overlay */}
            <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br', gradient)} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary group-hover:bg-blue-500/10 transition-colors">
                        {icon}
                    </div>
                </div>
                <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
                )}
            </div>
        </motion.div>
    );
}
