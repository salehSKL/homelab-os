'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
                {icon || <Package className="w-7 h-7 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            {action}
        </motion.div>
    );
}
