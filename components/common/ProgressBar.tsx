'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    gradient?: string;
}

export function ProgressBar({
    value,
    className,
    showLabel = true,
    size = 'md',
    gradient = 'from-blue-500 to-cyan-500',
}: ProgressBarProps) {
    const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground font-medium">Progress</span>
                    <span className="text-xs font-bold text-foreground">{value}%</span>
                </div>
            )}
            <div className={cn('w-full rounded-full bg-secondary overflow-hidden', heights[size])}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className={cn('h-full rounded-full bg-gradient-to-r shadow-sm', gradient)}
                />
            </div>
        </div>
    );
}
